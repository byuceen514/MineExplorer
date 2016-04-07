from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import TextInput,Button



@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'mineexplorer/home.html', context)

def area(request):
    """
    Controller for the app home page.
    """

    context = {}

    return render(request, 'mineexplorer/area.html', context)

def user_documentation(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'mineexplorer/user_documentation.html', context)

def help_file(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'mineexplorer/help_file.html', context)