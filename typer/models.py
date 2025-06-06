from django.db import models, transaction
from django.contrib.auth.models import User
from django.db.models import Max, F
from django.db.models.signals import post_delete
from django.dispatch import receiver


class Language(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10)
    def __str__(self):
        return self.name


class Lesson(models.Model):
    order = models.PositiveIntegerField(null=True, blank=True)
    title = models.CharField(max_length=100)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    content = models.TextField()
    is_typing = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        
    def save(self, *args, **kwargs):
        if self.order is None:
            # Auto-assign max order + 1 if no order provided
            max_order = Lesson.objects.filter(language=self.language).aggregate(Max("order"))["order__max"]
            self.order = 1 if max_order is None else max_order + 1
        else:
            # Shift existing orders >= new order to the right by 1
            with transaction.atomic():
                Lesson.objects.filter(language=self.language, order__gte=self.order).update(
                    order=F("order") + 1
                )
        super().save(*args, **kwargs)

    def get_order(self, language):
        return Lesson.objects.filter(language=language, order__gte=self.order)

    def __str__(self):
        return f"{self.language.code} {self.order}: {self.title}"


class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    wpm = models.PositiveIntegerField(default=0)
    accuracy = models.PositiveIntegerField(default=0)
    time_taken = models.PositiveIntegerField(default=0)  # seconds

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"


@receiver(post_delete, sender=Lesson)
def reorder_after_delete(sender, instance, **kwargs):
    lessons = Lesson.objects.order_by("order")
    for idx, lesson in enumerate(lessons, start=1):
        if lesson.order != idx:
            lesson.order = idx
            lesson.save()
            

