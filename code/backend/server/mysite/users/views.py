import json
from urllib import response
from django.forms import ValidationError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from .serializers import UserSerializers
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import User
import jwt
import datetime
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout


class DeleteAccountView(APIView):
    def delete(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        # Delete user account
        user.delete()
        messages.success(
            request, 'Your account has been deleted successfully.')
        return JsonResponse({"message": "Delete user successfully"}, status=200)


class RegisterView(APIView):
    def post(self, request):
        user_serializer = UserSerializers(data=request.data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        return Response(user_serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('incorrect password!')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()

        }
        token = jwt.encode(payload, 'secret',
                           algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)

        response.data = {
            'jwt': token}

        return response


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializers(user)

        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response


class ChangeUserDetailsView(APIView):
    def post(self, request, user_id):
        try:
            # Retrieve the user with the given ID or raise a 404 error
            user = get_object_or_404(User, pk=user_id)

            # Get the new data from the request data, or use the current user data as default
            new_data = request.data
            first_name = new_data.get('first_name', user.first_name)
            last_name = new_data.get('last_name', user.last_name)
            email = new_data.get('email', user.email)
            gender = new_data.get('gender', user.gender)
            city = new_data.get('city', user.city)
            street = new_data.get('street', user.street)
            house_number = new_data.get('houseNumber', user.houseNumber)
            date_of_birth = new_data.get('dateOfBirth', user.dateOfBirth)

            # Update the user data with the new data
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.gender = gender
            user.city = city
            user.street = street
            user.houseNumber = house_number
            user.dateOfBirth = date_of_birth
            user.save()

         
            return JsonResponse({
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "gender": gender,
                "city": city,
                "street": street,
                "house_number": house_number,
                "date_of_birth": date_of_birth,
            })

        except User.DoesNotExist:
            # Return a 404 error response if the user with the given ID does not exist
            return JsonResponse({"message": "User not found."}, status=404)

        except ValidationError as e:
            # Return a 400 error response if there is a validation error
            return JsonResponse({"message": str(e)}, status=400)

        except Exception as e:
            # Return a 500 error response for any other unexpected errors
            return JsonResponse({"message": "An error occurred while updating user details."}, status=500)
