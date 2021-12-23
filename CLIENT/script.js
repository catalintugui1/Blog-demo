const root = document.getElementById('root');

let numberOfArticles = 4;
let indexStart = 0;
let indexEnd = numberOfArticles - 1;
let totalNumberOfArticles = 0;

function updateStartEndIndexes(button) {
    if (button === 'next') {
        indexStart = indexStart + numberOfArticles;
        indexEnd = indexEnd + numberOfArticles;
        console.log(indexStart, indexEnd);
    }

    if (button === 'previous') {
        indexStart = indexStart - numberOfArticles;
        indexEnd = indexEnd - numberOfArticles;
        console.log(indexStart, indexEnd);
    }
}

function updatePrevAndNextButtons() {
    let prevBtn = document.getElementById('button-prev');
    let nextBtn = document.getElementById('button-next');

    if (indexStart === 0) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.display = "block";
    }

    if (indexEnd >= totalNumberOfArticles - 1) {
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "block";
    }
}

// CREATING NAV BAR
const nav = ['Travel updates', 'Reviews', 'About', 'Contact'];

function createNav(nav) {
    const navBar = document.createElement('nav');
    navBar.setAttribute('class', 'nav');

    const ul = document.createElement('ul');
    ul.setAttribute('class', 'nav__container');
    navBar.appendChild(ul);

    nav.forEach(element => {
        const li = document.createElement('li');
        li.setAttribute('class', 'nav__item');
        const anchor = document.createElement('a');
        anchor.setAttribute('href', '#/');
        anchor.setAttribute('class', 'nav__link');
        anchor.textContent = element;

        ul.appendChild(li);
        li.appendChild(anchor);

    })

    return navBar;
}

function renderNavBar(nav) {
    const domNavBar = createNav(nav);
    root.appendChild(domNavBar);
    createNav(nav);

}


// CREATING THE ADD BUTTON

function createAddButton() {
    const div = document.createElement('div');
    div.setAttribute('class', 'add__container');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'button open-modal');
    button.textContent = '+ Add Article';
    button.addEventListener('click', function() {
        openModal();
    })
    div.appendChild(button);
    return div;
}

function renderAddButton() {
    const domButton = createAddButton();
    root.appendChild(domButton);
    createAddButton();
}


// TAKING DATA FROM SERVER
function getData() {
    fetch(`http://localhost:3007/articles?indexStart=${indexStart}&indexEnd=${indexEnd}`)
        .then(
            function(response) {
                if (response.status !== 200) {

                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json()
                    .then(data => {
                        console.log(data)
                        window.onhashchange = locationHashChange(data.articlesList);
                        totalNumberOfArticles = data.numberOfArticles;
                        updatePrevAndNextButtons();
                    });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}
getData();


// CREATE ALL ARTICLES FROM MAIN PAGE 
function createArticle(articles) {
    const domArticle = document.createElement('article');
    console.log(articles)

    articles.forEach(element => {
        const articleDiv = document.createElement('div');
        articleDiv.setAttribute('id', 'article' + element.id);
        const domTitle = document.createElement('h2');
        domTitle.textContent = element.title;
        domTitle.setAttribute('class', 'title');

        const domUl = document.createElement('ul');
        domUl.setAttribute('class', 'info__container');

        const domList1 = document.createElement('li');
        domList1.setAttribute('class', 'info__item');
        domList1.textContent = element.tag;

        const domList2 = document.createElement('li');
        domList2.setAttribute('class', 'info__item');
        domList2.textContent = element.author;

        const domSpan = document.createElement('span');
        domSpan.setAttribute('class', 'info__mark point');
        domSpan.textContent = 'Jonnathan Mercadina';
        const domList3 = document.createElement('li');
        domList3.setAttribute('class', 'info__item');
        domList3.textContent = element.date;

        domUl.appendChild(domList1);
        domUl.appendChild(domList2);
        domList2.appendChild(domSpan);
        domUl.appendChild(domList3);

        const domImg = document.createElement('img');
        domImg.setAttribute('src', element.imgUrl);
        domImg.setAttribute('alt', element.imgAlt);

        const domActionDiv = document.createElement('div');
        domActionDiv.setAttribute('class', 'actions__container');

        const editButton = document.createElement('button');
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('class', 'actions__btn border');
        editButton.setAttribute('id', element.id);
        editButton.textContent = 'Edit'
        editButton.addEventListener('click', function() {
            openModal()
            editArticle(element);
            document.querySelector('.button-edit-modal').style.display = 'block';
            document.querySelector('.button--pink').style.display = 'none';
        })

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('class', 'actions__btn');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteArticle(element.id);
        })

        domActionDiv.appendChild(editButton);
        domActionDiv.appendChild(deleteButton);

        const paragraph = document.createElement('p');
        paragraph.textContent = element.content.substring(0, element.content.length / 2);

        const domContainer = document.createElement('div');
        domContainer.setAttribute('class', 'content__container');
        domContainer.appendChild(paragraph);

        const readMoreDiv = document.createElement('div');
        readMoreDiv.setAttribute('class', 'readmore__container');

        const readMoreAnchor = document.createElement('a');
        readMoreAnchor.setAttribute('class', 'btn-details');
        readMoreAnchor.setAttribute('href', '#/article' + element.id);

        const readMoreButton = document.createElement('button');
        readMoreButton.setAttribute('type', 'button');
        readMoreButton.setAttribute('class', 'button button-details');
        readMoreAnchor.setAttribute('href', '#/article' + element.id);
        readMoreButton.textContent = 'Read More';
        readMoreButton.addEventListener('click', function() {
            location.hash = '#/article/' + element.id;
            location.reload();
        })


        readMoreDiv.appendChild(readMoreAnchor);
        readMoreAnchor.appendChild(readMoreButton);

        domArticle.appendChild(articleDiv);
        articleDiv.appendChild(domTitle);
        articleDiv.appendChild(domUl);
        articleDiv.appendChild(domActionDiv);
        articleDiv.appendChild(domImg);
        articleDiv.appendChild(domContainer);
        articleDiv.appendChild(readMoreDiv);

    });
    return domArticle;

}

// RENDERING ALL ARTICLES FROM MAIN PAGE
function renderArticle(articles) {
    clearRoot();
    renderNavBar(nav);
    renderAddButton();
    const domArticle = createArticle(articles);
    root.appendChild(domArticle);
    createArticle(articles);
    renderFooter();
}

// CREATE FOOTER FROM MAIN PAGE
function createFooter() {
    const footer = document.createElement('footer');
    footer.setAttribute('class', 'footer');
    const previousButton = document.createElement('button');

    previousButton.setAttribute('class', 'footer__link footer__link--previous');
    previousButton.setAttribute('id', 'button-prev')
    previousButton.textContent = 'previous';

    previousButton.addEventListener('click', function() {
        updateStartEndIndexes('previous');
        getData();
    });

    const nextButton = document.createElement('button');
    nextButton.setAttribute('id', 'button-next');
    nextButton.setAttribute('class', 'footer__link footer__link--next');
    // nextButton.setAttribute('id', 'button-next')
    nextButton.textContent = 'next';

    nextButton.addEventListener('click', () => {
        updateStartEndIndexes('next');
        getData();
    });

    footer.appendChild(previousButton);
    footer.appendChild(nextButton);

    return footer;
}

// RENDER FOOTER FROM MAIN PAGE
function renderFooter() {
    const domFooter = createFooter();
    root.appendChild(domFooter);
    createFooter();
}

// CREATE FOOTER FROM DETAILS PAGE
function detailsFooter(article, artLength, index) {
    console.log(article);
    console.log(artLength)
        // console.log(index[article]);
    console.log(index)
    const footer = document.createElement('footer');
    footer.setAttribute('class', 'footer');
    const previousButton = document.createElement('button');

    previousButton.setAttribute('class', 'footer__link footer__link--previous');
    previousButton.textContent = 'previous';

    const nextButton = document.createElement('button');
    nextButton.setAttribute('id', 'button-next');
    nextButton.setAttribute('class', 'footer__link footer__link--next');
    nextButton.textContent = 'next';

    // if (location.hash.includes('#/article/1')) {
    //     previousButton.style.visibility = 'hidden';
    // } else if (location.hash.includes(`#/article/` + artLength)) {
    //     nextButton.style.visibility = 'hidden';
    // }
    if (location.hash.includes('#/article/1')) {
        previousButton.style.visibility = 'hidden';
    } else if (location.hash.includes(`#/article/` + artLength)) {
        nextButton.style.visibility = 'hidden';
    }
    // nextButton.addEventListener('click', function() {
    //     if (article.id >= 1 && article.id < artLength) {
    //         // changing the route to the next article
    //         location.hash = '#/article' + (article.id + 1);
    //         // reloading page
    //         location.reload();
    //     }
    // })

    nextButton.addEventListener('click', function() {
        if (article.id >= 1 && article.id < artLength) {
            // changing the route to the next article
            location.hash = '#/article/' + (article.id + 1);
            // reloading page
            location.reload();
        }
    })

    previousButton.addEventListener("click", function() {
        if (article.id <= artLength) {
            // changing the route to the previous article
            location.hash = '#/article/' + (article.id - 1);
            // reload the page
            location.reload();
        }
    })

    footer.appendChild(previousButton);
    footer.appendChild(nextButton);

    return footer;
}

// RENDERING FOOTER FROM DETAILS PAGE
function renderDetailsFooter(article, artLength) {
    const domFooter = detailsFooter(article, artLength);
    root.appendChild(domFooter);
    detailsFooter(article, artLength);
}

// CREATING ONE DETAILED ARTICLE
function createArticleDetails(article) {
    const domArticle = document.createElement('article');

    const divArticle = document.createElement('div');
    divArticle.setAttribute('id', 'article' + article.id);
    domArticle.appendChild(divArticle);
    const domTitle = document.createElement('h2');
    domTitle.textContent = article.title;
    domTitle.setAttribute('class', 'title');

    const domUl = document.createElement('ul');
    domUl.setAttribute('class', 'info__container');

    const domList1 = document.createElement('li');
    domList1.setAttribute('class', 'info__item');
    domList1.textContent = article.tag;

    const domList2 = document.createElement('li');
    domList2.setAttribute('class', 'info__item');
    domList2.textContent = article.author;

    const domSpan = document.createElement('span');
    domSpan.setAttribute('class', 'info__mark point');
    domSpan.textContent = 'Jonnathan Mercadina';

    const domList3 = document.createElement('li');
    domList3.setAttribute('class', 'info__item');
    domList3.textContent = article.date;

    domUl.appendChild(domList1);
    domUl.appendChild(domList2);
    domList2.appendChild(domSpan);
    domUl.appendChild(domList3);

    const domImg = document.createElement('img');
    domImg.setAttribute('src', article.imgUrl);
    domImg.setAttribute('alt', article.imgAlt);

    divArticle.appendChild(domTitle);
    divArticle.appendChild(domUl);
    divArticle.appendChild(domImg);

    const firstParagraph = document.createElement('p');
    firstParagraph.textContent = article.content.substring(0, article.content.length / 2);

    const secondParagraph = document.createElement('p');
    secondParagraph.textContent = article.content.substring(article.content.length / 2);

    const saying = document.createElement('p');
    saying.setAttribute('class', 'saying');
    saying.textContent = article.saying;

    divArticle.appendChild(firstParagraph);
    divArticle.appendChild(saying);
    divArticle.appendChild(secondParagraph);

    return domArticle;
}


// RENDERING THE ARTICLE CREATED ABOVE
function renderSingleArticleDetails(article) {
    const domArticle = createArticleDetails(article);
    root.appendChild(domArticle);
    createArticleDetails(article);

}


// iterating through all articles and render single article depending of the hash
function renderAllArticlesDetails(articles) {
    clearRoot();
    console.log(articles)
    Array.from(articles).forEach((item, index) => {
        if (location.hash.includes(item.id)) {
            renderNavBar(nav);
            renderSingleArticleDetails(item);
            renderDetailsFooter(item, articles.length, index);
        }
    });

    // for (let i = 1; i < articles.length; i++) {
    //     if (location.hash === '#/article/' + (i)) {
    //         renderNavBar(nav);
    //         renderSingleArticleDetails(articles[i]);
    //         renderDetailsFooter(articles[i], articles.length, i);
    //     }
    // }
}

function page404() {
    let errorDiv = document.createElement('div');
    errorDiv.setAttribute('class', 'error-box');
    let errorParagraph = document.createElement('h1');
    errorParagraph.setAttribute('class', 'error-message');
    errorParagraph.textContent = 'Error 404 - Article not found!'

    let goToHomepageButton = document.createElement('button');
    goToHomepageButton.setAttribute('type', 'button');
    goToHomepageButton.setAttribute('class', 'to-homepage');
    goToHomepageButton.textContent = 'BACK TO HOMEPAGE';
    goToHomepageButton.addEventListener('click', function() {
        location.hash = '#/';
        location.reload();
    })

    errorDiv.appendChild(errorParagraph);
    errorDiv.appendChild(goToHomepageButton);
    root.appendChild(errorDiv);
}

// CREATE MODAL
let modal = document.getElementById("modal-box");

function createModal() {
    const modalDiv = document.createElement('div');
    modalDiv.setAttribute('class', 'modal');

    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal__content');

    const modalTitle = document.createElement('h2');
    modalTitle.setAttribute('class', 'title modal-title');
    modalTitle.textContent = "Add/Edit article";

    const inputsContainer = document.createElement('div');
    inputsContainer.setAttribute('class', 'inputs__container');

    const input1 = document.createElement('input');
    input1.setAttribute('type', 'text');
    input1.setAttribute('class', 'input margin');
    input1.setAttribute('id', 'title')
    input1.setAttribute('placeholder', 'Please enter title');

    const input2 = document.createElement('input');
    input2.setAttribute('type', 'text');
    input2.setAttribute('class', 'input');
    input2.setAttribute('id', 'tag')
    input2.setAttribute('placeholder', 'Please enter tag');

    const input3 = document.createElement('input');
    input3.setAttribute('type', 'text');
    input3.setAttribute('class', 'input margin');
    input3.setAttribute('id', 'author')
    input3.setAttribute('placeholder', 'Please enter author');

    const input4 = document.createElement('input');
    input4.setAttribute('type', 'text');
    input4.setAttribute('class', 'input');
    input4.setAttribute('id', 'date')
    input4.setAttribute('placeholder', 'Please enter date');

    const input5 = document.createElement('input');
    input5.setAttribute('type', 'text');
    input5.setAttribute('class', 'input margin');
    input5.setAttribute('id', 'url')
    input5.setAttribute('placeholder', 'Please enter image url');

    const input6 = document.createElement('input');
    input6.setAttribute('type', 'text');
    input6.setAttribute('class', 'input');
    input6.setAttribute('id', 'saying')
    input6.setAttribute('placeholder', 'Please enter saying');

    const textarea = document.createElement('textarea');
    textarea.setAttribute('class', 'textarea');
    textarea.setAttribute('id', 'textarea')
    textarea.setAttribute('name', 'content');
    textarea.setAttribute('cols', '28');
    textarea.setAttribute('rows', '7');
    textarea.setAttribute('placeholder', 'Please enter content');

    const modalButtonsDiv = document.createElement('div');
    modalButtonsDiv.setAttribute('class', 'modal__buttons');

    const closeModalButton = document.createElement('button');
    closeModalButton.setAttribute('type', 'button');
    closeModalButton.setAttribute('class', 'button close-modal');
    closeModalButton.textContent = 'Cancel';

    const saveModalButton = document.createElement('button');
    saveModalButton.setAttribute('type', 'button');
    saveModalButton.setAttribute('class', 'button button--pink');
    saveModalButton.textContent = 'Save';
    saveModalButton.addEventListener('click', function() {
        createNewArticle();
    })

    const editModalButton = document.createElement('button');
    editModalButton.setAttribute('type', 'button');
    editModalButton.setAttribute('class', 'button button-edit-modal');
    editModalButton.textContent = 'Edit';

    modalDiv.appendChild(modalContent);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(inputsContainer);
    inputsContainer.appendChild(input1);
    inputsContainer.appendChild(input2);
    inputsContainer.appendChild(input3);
    inputsContainer.appendChild(input4);
    inputsContainer.appendChild(input5);
    inputsContainer.appendChild(input6);
    modalContent.appendChild(textarea);
    modalContent.appendChild(modalButtonsDiv);
    modalButtonsDiv.appendChild(closeModalButton);
    modalButtonsDiv.appendChild(saveModalButton);
    modalButtonsDiv.appendChild(editModalButton);

    return modalDiv;
}

// RENDER THE MODAL
function renderModal() {
    const domModal = createModal();
    modal.appendChild(domModal);
    createModal();
}

renderModal();

// CLEAR THE CONTENT
function clearRoot() {
    root.innerHTML = '';
}

// EDIT ARTICLE FUNCTION
function editArticle(article) {
    let title = document.getElementById('title');
    let tag = document.getElementById('tag');
    let author = document.getElementById('author');
    let date = document.getElementById('date');
    let url = document.getElementById('url');
    let saying = document.getElementById('saying');
    let textarea = document.getElementById('textarea');

    title.value = article.title;
    tag.value = article.tag;
    author.value = article.author;
    date.value = article.date;
    url.value = article.imgUrl;
    saying.value = article.saying;
    textarea.value = article.content;

    let saveModalButton = document.querySelector('.button-edit-modal');
    saveModalButton.addEventListener('click', function() {
        updateArticle(article.id)
    })
}
console.log(location.hash.substring(10))
    // CREATE HASH ROUTE
function locationHashChange(articles) {

    if (location.hash === '#/') {
        renderArticle(articles);
        return;
    } else {
        let currentWindowHash = window.location.hash;
        let articleId = currentWindowHash.substring(10);
        if (Number(articleId) <= articles.length)
            renderAllArticlesDetails(articles);
        else {
            page404();
        }
    }

}


// GETTING THE ELEMENTS TO CLOSE THE MODAL
let modalOverlay = document.querySelector(".modal__overlay");
let closeModal = document.querySelector(".close-modal")

// OPEN MODAL FUNCTION, called directly in the function that creates the ADD BUTTON
function openModal() {
    modalOverlay.style.visibility = "visible";
    modalOverlay.style.opacity = 1;
}

// CLOSING THE MODAL
closeModal.addEventListener("click", function() {
    modalOverlay.style.visibility = "hidden";
    modalOverlay.style.opacity = 0;

    // location.hash = "#/";
    // location.reload();
})

// DELETING ARTICLE DEPENDING ON THE ID, function called directly where the delete button is created (createArticle)
function deleteArticle(id) {
    fetch('http://localhost:3000/articles/' + id, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            console.log(data, id)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


// CREATING NEW ARTICLE, UPDATING THE ARTICLE LIST
function createNewArticle() {
    let title = document.getElementById('title').value;
    let tag = document.getElementById('tag').value;
    let author = document.getElementById('author').value;
    let date = document.getElementById('date').value;
    let imgUrl = document.getElementById('url').value;
    let saying = document.getElementById('saying').value;
    let textarea = document.getElementById('textarea').value;

    fetch('http://localhost:3007/articles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            "title": title,
            "imgUrl": imgUrl,
            "imgAlt": 'photo',
            "content": textarea,
            "tag": tag,
            "author": author,
            "date": date,
            "saying": saying,
        })

    }).then(res => res.json())

    .then(data =>

        console.log(data))

    .catch((err) => console.log(err));
}



// EDITING ARTICLE
function updateArticle(id) {
    let title = document.getElementById('title').value;
    let tag = document.getElementById('tag').value;
    let author = document.getElementById('author').value;
    let date = document.getElementById('date').value;
    let imgUrl = document.getElementById('url').value;
    let saying = document.getElementById('saying').value;
    let textarea = document.getElementById('textarea').value;

    const putObject = {
        title: title,
        tag: tag,
        author: author,
        li3: date,
        imgUrl: imgUrl,
        saying: saying,
        content: textarea,
    }
    fetch('http://localhost:3000/articles/' + id, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(putObject),
        })
        .then(response => response.json())
        .then((data) => {

            window.onhashchange = locationHashChange(data);

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// paragraphs split DONE
// not found page/page DONE
// previous/next buttons
// refactoring DONE
// prev and next for main page - only 4 articles per page

// DARK MODE
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
let body = document.querySelector('body');

function switchTheme(e) {
    if (e.target.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}


toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}