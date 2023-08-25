const postsWrapper = document.querySelector('.posts-wrapper');
const empty = document.querySelector('.empty');
let skip = 0;
let limit = 3;
let dataUser = [];
const copyDataUser = [];
let arrPosts = [];

callFetch(skip, limit);

function callFetch(sk, li) {
	let urlUser = `https://dummyjson.com/users?skip=${sk}&limit=${li}`;
	let urlPosts = `https://dummyjson.com/posts?skip=${sk}&limit=${li}`;
      
	Promise.all([fetch(urlUser), fetch(urlPosts)])
	.then(responses => Promise.all([responses[0].json(), responses[1].json()]))
	.then(data => {
		dataUser = data;
		copyDataUser.push(...dataUser);
		createUsers(copyDataUser);
	})
	.catch(error => {
		console.log(error);
	});
};

function createUsers(copyDataUser) {
	for (let i = 0; i < copyDataUser[0].users.length; i++) {
		createUser(copyDataUser[copyDataUser.length - 2], i);
	};

	for (let i = 0; i < copyDataUser[1].posts.length; i++) {
	      createPost(copyDataUser[copyDataUser.length - 1], i);
	};
};

function createUser(elem, i) {
	const userContainer = document.createElement('div');
	const userAvatar = document.createElement('img'); 
	const userName = document.createElement('div');
	userContainer.setAttribute("id", elem.users[i].id);
	userName.innerText = elem.users[i].username;
	userAvatar.setAttribute("src", elem.users[i].image);
	userContainer.classList.add('user-name-container');
	userContainer.appendChild(userAvatar);
	userContainer.appendChild(userName);
	
	arrPosts.push(userContainer);
	
	if (arrPosts.length % 6 === 0) {
		sortPosts(arrPosts);
		arrPosts = [];
	};
	empty.classList.remove('empty');
};

function createPost(elem, i) {
	const postsContainer = document.createElement('div');
	const postTitle = document.createElement('div');
	const postText = document.createElement('div');
	postsContainer.setAttribute("id", elem.posts[i].id);
	postTitle.innerHTML = `<h3>${elem.posts[i].title}</h3>`;
	postText.innerText = elem.posts[i].body;
	postsContainer.appendChild(postTitle);
	postsContainer.appendChild(postText);
	
	arrPosts.push( postsContainer);
	
	if (arrPosts.length % 6 === 0) {
		sortPosts(arrPosts);
		arrPosts = [];
	};
	empty.classList.remove('empty');
};


function sortPosts(arrPosts) {
	arrPosts.sort((a, b) => {
		const idA = parseInt(a.getAttribute("id"));
		const idB = parseInt(b.getAttribute("id"));
		return idA - idB;
	});
	
	for (let i = 0; i < arrPosts.length; i++) {
		let currentId = arrPosts[i].getAttribute("id");
		if ((i + 1 < arrPosts.length) && (currentId === arrPosts[i + 1].getAttribute("id"))) {
			const container = document.createElement('div');
			container.appendChild(arrPosts[i]);
			container.appendChild(arrPosts[i + 1]);
			container.classList.add('post');
			postsWrapper.appendChild(container);
			i++;
		};
	};
};

const observer = new IntersectionObserver((entries, observer) => {
	const isIntersecting = entries[0].isIntersecting;
	if (isIntersecting) {
		dataUser = [];
		callFetch(skip+=3, limit);
	} else if (skip === 30) {
		observer.unobserve(entries[0].target);
	};
});

observer.observe(empty);