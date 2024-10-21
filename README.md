# Проект ___"настоящий друг"___


## запуска проекта

### бекенд

**рекомундую самостоятельно скопипастить эти команды в cmd, тк powershell будет блочить**

- Чтобы не засорять питон создадим виртуальное окружение

```shell
python -m venv venv
```

- включим его

```shell
venv\Scripts\activate
```

- Установим зависимости

```shell
pip install -r requirements.txt
```

- запустим проект

```shell
python manage.py runserver
```

### фронтенд

**перейдем в папку frontend и установим зависимости**

```shell
cd frontend
npm i 
npm start
```