from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import JsonResponse
from .models import Language, Lesson, UserProgress
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.shortcuts import redirect

def menu(request):
    languages = Language.objects.all()
    selected_lang_id = request.GET.get('language')
    if selected_lang_id:
        lessons = Lesson.objects.filter(language_id=selected_lang_id).order_by('order')
    else:
        lessons = Lesson.objects.filter(language=languages.first()).order_by('order') if languages else []
    return render(request, 'turbo_typing/menu.html', {
        'languages': languages,
        'lessons': lessons,
        'request': request,
    })

def typing_page(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    return render(request, 'turbo_typing/typing_page.html', {
        'lesson': lesson,
    })

def results_page(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    progress = UserProgress.objects.filter(user=request.user, lesson=lesson).order_by('-created_at').first()
    next_lesson = Lesson.objects.filter(language=lesson.language, order__gt=lesson.order).order_by('order').first()
    return render(request, 'turbo_typing/results_page.html', {
        'lesson': lesson,
        'progress': progress,
        'next_lesson': next_lesson,
    })

def submit_typing(request):
    if request.method == 'POST':
        lesson_id = request.POST.get('lesson_id')
        typed_text = request.POST.get('typed_text')
        lesson = get_object_or_404(Lesson, id=lesson_id)
        expected = lesson.content.replace('\n', ' ').replace('\r', '').strip()
        correct = sum(1 for i, c in enumerate(typed_text) if i < len(expected) and c == expected[i])
        accuracy = round((correct / max(1, len(expected))) * 100)
        words = len(typed_text.strip().split())
        time_taken = int(request.POST.get('time_taken', 1))
        wpm = round(words / (time_taken / 60))
        progress = UserProgress.objects.create(
            user=request.user,
            lesson=lesson,
            wpm=wpm,
            accuracy=accuracy,
            time_taken=time_taken,
        )
        return JsonResponse({'success': True, 'redirect': reverse('results_page', args=[lesson.id])})
    return JsonResponse({'success': False})

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        if password1 != password2:
            return render(request, 'registration/register.html', {'error': 'Passwords do not match'})
        if User.objects.filter(username=username).exists():
            return render(request, 'registration/register.html', {'error': 'Username already exists'})
        if User.objects.filter(email=email).exists():
            return render(request, 'registration/register.html', {'error': 'Email already in use'})
        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)
        return redirect('menu')
    return render(request, 'registration/register.html')
