# pet-clone-backend

# NEED

- [x] Коды ответа HTTP
- [x] await newPost.save(`{ createPostSession }`); - неверно | await newPost.save(`{ session: createPostSession }`); - верно
- [x] `const postId = req.params.id;` - получить параметр из запроса (напр. `localhost/:id`) 

# ЧТО?

- [x] `res.json({ ...userData })` - В результате все свойства userData будут скопированы в новый объект. Если userData содержит объекты или вложенные структуры данных, они также будут скопированы, и новый объект будет содержать глубокие копии данных

- [x]  `res.json( userData );` -  В этом случае, userData отправляется как есть в ответе.

<br>
<br>
<hr>

# TODO 

<h3>+ Dashboard </h3>

- [ ] Удаление борда === удаление из БД / изменение статуса (решить)
- [ ] Блокировка борда
- [ ] Изменение борда не проходит валидацию => Тебует имя / Такое имя уже существует
- [ ] Основные операции доделать
- [ ] Операции с контентом ( посты / обсуждения / подписки и тд )
<br>

- [x] checkUserRole - проверка роли для изменения борда (есть в utils) 


