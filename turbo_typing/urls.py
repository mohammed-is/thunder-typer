from django.urls import path
from . import views

urlpatterns = [
    path('', views.menu, name='menu'),
    path('lesson/<int:lesson_id>/', views.typing_page, name='typing_page'),
    path('results/<int:lesson_id>/', views.results_page, name='results_page'),
    path('submit_typing/', views.submit_typing, name='submit_typing'),
]