import requests
from decouple import config

# .env 파일에서 토큰 가져오기
GITHUB_ACCESS_TOKEN = config("GITHUB_ACCESS_TOKEN")

headers = {
    "Authorization": f"Bearer {GITHUB_ACCESS_TOKEN}"
}

try:
    response = requests.get("https://api.github.com/user", headers=headers)

    if response.status_code == 200:
        print("GitHub API 연동 성공:")
        print(response.json())
    else:
        print("GitHub API 연동 실패:")
        print(f"Status Code: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"예외 발생: {str(e)}")
