from django.contrib import admin
from .models import Language, Lesson, UserProgress

class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'language', 'order', 'is_typing')
    list_filter = ('language', 'is_typing')
    search_fields = ('title',)
    ordering = ('language', 'order')

class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'completed', 'wpm', 'accuracy', 'time_taken')
    list_filter = ('completed', 'lesson__language')
    search_fields = ('user__username', 'lesson__title')

admin.site.register(Language)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(UserProgress, UserProgressAdmin)
