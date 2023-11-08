<!DOCTYPE html>
<html>
<head>
    <title>회원가입 페이지</title>
</head>
<body>
    <h1>회원가입</h1>
    <form action="/signup" method="POST">

        <label for="username">사용자 이름:</label>
        <input type="text" id="username" name="username" required>
        <br>

        <label for="student_id">학번 이메일:</label>
        <input type="text" id="email" name="email" required>

        <label for="password">비밀번호:</label>
        <input type="password" id="password" name="password" required>
        <br>

        <input type="submit" value="가입하기">
    </form>
</body>
</html>
