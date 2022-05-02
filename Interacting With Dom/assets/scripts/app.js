const addMovieModal = document.getElementById('add-modal');
// console.log(addMovieModal);

const startAddMovieButton = document.querySelector('header button');

const backdrop = document.getElementById('backdrop');

const cancleAddMovieButton = addMovieModal.querySelector('.btn--passive');
const confirmAddMovieButton = cancleAddMovieButton.nextElementSibling;
const userInputs = addMovieModal.querySelectorAll('input');
// const userInputs = addMovieModal.getElementsByTagName('input');
const entryTextSection = document.getElementById('entry-text');
const deleteMovieModal = document.getElementById('delete-modal');

const movies = [];

const toggleBackdrop = () => {
    backdrop.classList.toggle('visible');
};

const updateUI = () => {
    if(movies.length === 0){
        entryTextSection.style.display = 'block';
    }else{
        entryTextSection.style.display = 'none';
    }
};

const closeMovieDeletionModal = () => {
    toggleBackdrop();
    deleteMovieModal.classList.remove('visible');
};

const deleteMovieHandler = (movieId) => {
    let movieIndex = 0;
    for(const movie of movies){
        if(movie.id === movieId){
            break;
        }
        movieIndex++;
    }    
    movies.splice(movieIndex,1);
    const listRoot = document.getElementById('movie-list');
    listRoot.children[movieIndex].remove();
    //listRoot.removeChild(listRoot.children[movieIndex]);
    closeMovieDeletionModal();
    updateUI();
};

const startDeleteMovieHandler = movieId => {
    deleteMovieModal.classList.add('visible');
    toggleBackdrop();
    const cancleDeletionButton = deleteMovieModal.querySelector('.btn--passive');
    let confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');
  
    confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));
    
    confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');
  
    //confirmDeletionButton.removeEventListener('click',deleteMovieHandler.bind(null,movieId));
   
    cancleDeletionButton.removeEventListener('click',closeMovieDeletionModal);
    
    cancleDeletionButton.addEventListener('click',closeMovieDeletionModal);
    confirmDeletionButton.addEventListener('click',deleteMovieHandler.bind(null,movieId));
};

const renderNewMovieElement = (id, title,imageUrl,rating) => {
    const newMovieElement = document.createElement('li');
    newMovieElement.className = 'movie-element';
    newMovieElement.innerHTML = `
    <div class="movie-element__image"> 
        <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
        <h2>${title}</h2>
        <p>${rating}/5 stars</p>
    </div>
    `;
    newMovieElement.addEventListener('click',startDeleteMovieHandler.bind(null, id));
    const listRoot = document.getElementById('movie-list');
    listRoot.append(newMovieElement);
};

const closeMovieModal = () => {
    addMovieModal.classList.remove('visible');
};

const showMovieModal= () => {
    addMovieModal.classList.toggle('visible');
    toggleBackdrop();
}; 

const clearMovieInput = () => {
    for (const usrInputs of userInputs) {
        usrInputs.value = '';
   }
};

const cancleAddMovieHandler = () => {
    closeMovieModal();
    toggleBackdrop();
    clearMovieInput();
};

const addMovieHandler = () => {
    const titleValue = userInputs[0].value;
    const iamageUrlValue = userInputs[1].value;
    const ratingValue = userInputs[2].value;

    if(titleValue.trim() === '' || 
    iamageUrlValue.trim() === '' || 
    ratingValue.trim() === '' ||
     +ratingValue < 1 || +ratingValue > 5) {
            alert('Please enter valid input');
            return;
     }

     const newMovie = {
         id: Math.random().toString(),
         title: titleValue,
         image: iamageUrlValue,
         rating: ratingValue
     };
     movies.push(newMovie);
     console.log(movies);
     closeMovieModal();
     toggleBackdrop();
     clearMovieInput();
     renderNewMovieElement(newMovie.id,newMovie.title,newMovie.image,newMovie.rating);
     updateUI();
};

const backdropClickHandler = () => {
    closeMovieModal();
    closeMovieDeletionModal();
    clearMovieInput();
};

startAddMovieButton.addEventListener('click',showMovieModal);
backdrop.addEventListener('click',backdropClickHandler);
cancleAddMovieButton.addEventListener('click',cancleAddMovieHandler);
confirmAddMovieButton.addEventListener('click',addMovieHandler);
