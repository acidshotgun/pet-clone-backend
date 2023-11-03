# pet-clone-backend

# NEED

- [x] Коды ответа HTTP
- [x] await newPost.save(`{ createPostSession }`); - неверно | await newPost.save(`{ session: createPostSession }`); - верно

# ЧТО?

- [x] `res.json({ ...userData })` - В результате все свойства userData будут скопированы в новый объект. Если userData содержит объекты или вложенные структуры данных, они также будут скопированы, и новый объект будет содержать глубокие копии данных

- [x]  `res.json( userData );` -  В этом случае, userData отправляется как есть в ответе.


