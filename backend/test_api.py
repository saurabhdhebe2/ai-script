import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Script Generator API"}

def test_register():
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
            "name": "Test User"
        }
    )
    assert response.status_code in [200, 400]  # 400 if user exists

def test_login():
    response = client.post(
        "/api/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpassword123"
        }
    )
    assert response.status_code in [200, 401]
