from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from .models import Article

def article_list(request):
    articles = Article.objects.all()
    return render(request, 'articles/list.html', {'articles': articles})

@login_required
def article_create(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        text = request.POST.get('text')

        Article.objects.create(
            title=title,
            text=text,
            author=request.user
        )

        return redirect('article_list')

    return render(request, 'articles/create.html')

@login_required
def article_edit(request, pk):
    article = get_object_or_404(Article, pk=pk)

    if request.method == 'POST':
        article.title = request.POST.get('title')
        article.text = request.POST.get('text')
        article.save()
        return redirect('article_list')

    return render(request, 'articles/edit.html', {'article': article})

@login_required
def article_delete(request, pk):
    article = get_object_or_404(Article, pk=pk)
    article.delete()
    return redirect('article_list')

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()

    return render(request, 'registration/register.html', {'form': form})