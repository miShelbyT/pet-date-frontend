//DOM ELEMENT/VARIABLES
const petContainer = document.querySelector("#pet-collection")
const modal = document.querySelector(".modal-container")
const modalContent = document.querySelector(".modal-content")
const newPetButton = document.querySelector("#add-pet")
const navSpan = document.querySelector("#nav-span")

let simplePetArray = []


let allDates;
let toggle = "hide"
toggleModal(toggle)

/***************** URL variables *****************/
const petUrl = "http://localhost:3000/api/v1/pets"
const pdUrl = "http://localhost:3000/api/v1/playdates"

// INITIAL 
/*********** All Database Fetches ***************/
// GET all pets
async function fetchPets() {
  await fetch(petUrl)
  .then((resp) => resp.json())
  .then((petArray) => {
    petArray.forEach((pet) => {
      renderPets(pet)
      simplePetArray.push(pet.name)
    })
  })
}

// POST new Pet
async function createPet(addPetObj){
  await fetch(petUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify(addPetObj)
})
  .then(response => response.json())
  .then(newPetObj => {
    renderPets(newPetObj)})
}

// Fetch Data to render onto Modal
async function petDetails(id){
  await fetch(`${petUrl}/${id}`)
    .then((resp) => resp.json())
    .then((petObj) => {
      renderPet(petObj)
    });
};

//fetch Delete Playdate
function deletePlaydate(id) {
  fetch(`${pdUrl}/${id}`, {
    method: `DELETE`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })
    .then(resp => resp.json())
    .then(data => {
      li = document.querySelector(`li[data-id="${data.id}"]`)
      li.remove()
    })
}


// fetch Playdate POST
function pdPost(pdObj) {
  fetch(`${pdUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(pdObj)
  })
    .then(response => response.json())
    .then(pdObj => {   //pd stands for playdate
      const li = document.createElement("li")
      li.dataset.id = pdObj.id
      li.textContent = `Date: ${pdObj.date}, Location: ${pdObj.location}`

      const deleteBtn = document.createElement("button")
      const updateBtn = document.createElement("button")

      deleteBtn.textContent = "Cancel Playdate"
      deleteBtn.dataset.id = pdObj.id
      deleteBtn.className = "btn-styles"
      deleteBtn.classList.add("pd-delete")

      updateBtn.textContent = "Update Playdate"
      updateBtn.dataset.id = pdObj.id
      updateBtn.className = "pd-update"
      updateBtn.classList.add("btn-styles")

      li.append(deleteBtn, updateBtn)
      allDates.append(li)
    })
}

// fetch Playdate PATCH
function pdUpdate(newpdObj) {
  fetch(`${pdUrl}/${newpdObj.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(newpdObj)
  })
    .then(response => response.json())
    .then(data => {
      li = document.querySelector(`li[data-id="${data.id}"]`)
      li.textContent = `Date:${data.date}, Location:${data.location}`

      const deleteBtn = document.createElement("button")
      const updateBtn = document.createElement("button")
      
      deleteBtn.textContent = "Cancel Playdate"
      deleteBtn.dataset.id = data.id
      deleteBtn.className = "btn-styles"
      deleteBtn.classList.add("pd-delete")

      updateBtn.textContent = "Update Playdate"
      updateBtn.dataset.id = data.id
      updateBtn.className = "pd-update"
      updateBtn.classList.add("btn-styles")

      li.append(deleteBtn, updateBtn)
    })
}


/***************** Buttons ***********************/
// Add Playdates button
modalContent.addEventListener("click", (event) => {
  if (event.target.matches("#pd-button")) {
    const id = event.target.dataset.id

    createPlayDateForm(id)
  }
})

//delete playdate button
modalContent.addEventListener("click", event => {
  if (event.target.matches(".pd-delete")) {
    const id = event.target.dataset.id
    deletePlaydate(id)
  }
})

//update playdate Button
modalContent.addEventListener("click", event => {
  if (event.target.matches(".pd-update")){
    const id = event.target.dataset.id

    oldPDObj = {
      id: id,
      pet_id: event.target.dataset.pet,
      pet2_id: event.target.dataset.pet2,
      date: event.target.dataset.date,
      location: event.target.dataset.location

    }
    playdateUpdate(oldPDObj)
  }
})

//add a new pet button
newPetButton.addEventListener("click", event => {
    renderPetForm()
})

/*************** Rendering Functions ****************/

// Rendering Preliminary Data of all pets onto cards
function renderPets(pet){
  const petDiv = document.createElement("div")
  const petImg = document.createElement("img")
  const petName = document.createElement("h2")
  const petType = document.createElement("h4")
  const petButton = document.createElement("button")

  petDiv.className = "card"

  petName.textContent = pet.name
  petType.textContent = `Breed: ${pet.breed}`

  petButton.classList.add("deets")
  petButton.classList.add("btn-styles")

  petButton.textContent = "Pet Deets"
  petButton.dataset.id = pet.id

  petButton.addEventListener("click", () => {
    toggleModal()
    petDetails(pet.id)
  })

  petImg.src = pet.img
  petImg.alt = pet.name
  petImg.className = "pet-avatar"

  petDiv.append(petImg, petName, petType, petButton)

  petContainer.append(petDiv)
}


// renderPet renders Pet's info onto modal content
function renderPet(petObj){

  const petName = document.createElement("h2")
  const petBreed = document.createElement("h3")
  const petAge = document.createElement("h3")
  const showPetText = document.createElement("p")
  const petImg = document.createElement("img")
  const petPersonality = document.createElement("h4")
  const makePlaydateBtn = document.createElement("button")

 
  modalContent.innerHTML = ""
  petName.textContent = `Name: ${petObj.name}`
  petBreed.textContent = `Breed: ${petObj.breed}`
  petImg.src = petObj.img
  petPersonality.textContent = `Personality: ${petObj.temper}`

  // variable created so we can append playdates
  allDates = document.createElement("ul")
  allDates.textContent = "Playdates:"

  makePlaydateBtn.textContent = "Wanna Play?"
  makePlaydateBtn.dataset.id = petObj.id
  makePlaydateBtn.id = ("pd-button")
  makePlaydateBtn.className = ("btn-styles")
  makePlaydateBtn.classList.add("wanna-play")

  if (petObj.age > 1) {
    petAge.textContent = `Age: ${petObj.age} years old`
  } else {
    petAge.textContent = `Age; ${petObj.age} year old`
  }

  playDates(petObj)

  showPetText.append(petName, petBreed, petAge, petPersonality)
  modalContent.append(petImg, showPetText, allDates, makePlaydateBtn)
};


// Iterates thru to render playdate info onto modal content
function playDates(petObj) {
  if(petObj.playdates) {
    petObj.playdates.forEach(playdate => {
    const date = document.createElement("li")
    const deleteBtn = document.createElement("button")
    const updateBtn = document.createElement("button")

    deleteBtn.textContent = "Cancel Playdate"
    deleteBtn.dataset.id = playdate.id
    deleteBtn.className = "pd-delete"
    deleteBtn.classList.add("btn-styles")

    updateBtn.textContent = "Update Playdate"
    updateBtn.dataset.id = playdate.id
    updateBtn.dataset.pet = playdate.pet_id
    updateBtn.dataset.pet2 = playdate.pet2_id
    updateBtn.dataset.date = playdate.date
    updateBtn.dataset.location = playdate.location
    updateBtn.className = "pd-update"
    updateBtn.classList.add("btn-styles")

    date.dataset.id = playdate.id
    date.textContent = `Date: ${playdate.date}, Location: ${playdate.location}`

    date.append(deleteBtn, updateBtn)
    allDates.append(date)
  })
}

}

/************ Modal Functions **********/
//Toggle modal
function toggleModal() {
  modal.classList.toggle(`${toggle}`)
  // modalContent.classList.toggle(`${toggle}`)
}

modal.addEventListener("click", event => {
  // console.log(event.target)
  if (event.target.dataset.action === "close") {
    // debugger
    toggle = "hide"
    toggleModal(toggle)

  }
})

// modal form 
const createPlayDateForm = (petid) => {
  
  const form = document.createElement("form")
  const locationInput = document.createElement("input")
  const dateInput = document.createElement("input")
  const friendInput = document.createElement("select")
  const submitBtn = document.createElement("button")


  submitBtn.className = "submit-pd"
  submitBtn.classList.add("btn-styles")
  submitBtn.textContent = "Create Playdate"

  locationInput.id = "location"
  locationInput.placeholder = "enter location..."
  
  dateInput.type = "date"
  dateInput.id = "date"

  friendInput.type = "select"
  friendInput.id = "friends"
  friendInput.name = "friendlist"
  friendInput.form = "friendform"

  for (i = 0; i < simplePetArray.length ; i++){
    const petOption = document.createElement('option')
    
    if(simplePetArray[i].includes(' ')){
      let newPetOption = simplePetArray[i].replace(' ', '-')
      petOption.value = newPetOption
    }
    else {
      petOption.value = simplePetArray[i]
    }
    // debugger
    petOption.textContent = simplePetArray[i] 
    petOption.dataset.id = i + 1

    friendInput.append(petOption)
  }

  form.append(dateInput, friendInput, locationInput, submitBtn)
  modalContent.append(form)

  submitBtn.addEventListener("click", event => {
    event.preventDefault()
    const petOption = document.querySelector(`option[value=${friendInput.value}]`)
    console.log(petOption.dataset.id)
    pdObj = {
      pet_id: petid,
      pet2_id: petOption.dataset.id,
      date: form.date.value,
      location: form.location.value
    } 
    
    pdPost(pdObj)
    // form.style.display = "none"
    form.remove()
  
  })
}

//Updating Form 
const playdateUpdate = (oldPDObj) => {
  const form = document.createElement("form")
  const locationInput = document.createElement("input")
  const dateInput = document.createElement("input")
  const submitBtn = document.createElement("button")


  submitBtn.className = "submit-pd"
  submitBtn.classList.add("btn-styles")
  submitBtn.textContent = "Update Playdate"

  locationInput.id = "location"
  locationInput.value = oldPDObj.location
  
  dateInput.type = "date"
  dateInput.value = oldPDObj.date
  dateInput.id = "date"
  form.append(dateInput, locationInput, submitBtn)
  modalContent.append(form)

  submitBtn.addEventListener("click", event =>{
    event.preventDefault()

    newpdObj = {
      id: oldPDObj.id,
      pet_id: oldPDObj.petid,
      pet2_id: oldPDObj.pet2_id,
      date: form.date.value,
      location: form.location.value
    } 
    
    pdUpdate(newpdObj)
    // hides form after update
    form.style.display = "none"
  })

}


const renderPetForm = () => {
  const petForm = document.createElement("form")
  const petNameInput = document.createElement("input")
  const petTemperInput = document.createElement("input")
  const petAgeInput = document.createElement("input")
  const petBreedInput = document.createElement("input")
  const petGenderInput = document.createElement("input")
  const petSpeciesInput = document.createElement("input")
  const petImageInput = document.createElement("input")
  const petSubmitBtn = document.createElement("button")


  petSubmitBtn.className = "submit-pet"
  petSubmitBtn.classList.add("btn-styles")
  petSubmitBtn.textContent = "Add Pet"
  petSubmitBtn.type = "submit"

  petNameInput.id = "name"
  petNameInput.placeholder = "Pet Name"

  petTemperInput.id = "temper"
  petTemperInput.placeholder = "Pet's Personality"

  petAgeInput.id = "age"
  petAgeInput.type = "number"
  petAgeInput.placeholder = "Pet's Age"

  petBreedInput.id = "breed"
  petBreedInput.placeholder = "Pet's Breed"

  petGenderInput.id = "gender"
  petGenderInput.placeholder = "Pet's Gender"

  petSpeciesInput.id = "species"
  petSpeciesInput.placeholder = "Pet's Species"

  petImageInput.id = "image"
  petImageInput.placeholder = "Url link of your Pet"
  

  petForm.append(petNameInput, petTemperInput, petAgeInput, petBreedInput, petGenderInput,
     petSpeciesInput, petImageInput, petSubmitBtn)
  
  navSpan.append(petForm)

  petForm.addEventListener("submit", event =>{
    event.preventDefault()

    addPetObj = {
      name: petForm.name.value,
      temper: petForm.temper.value,
      age: petForm.age.value,
      breed: petForm.breed.value,
      gender: petForm.gender.value,
      species: petForm.species.value,
      img: petForm.image.value
    } 
    
    createPet(addPetObj)

    petForm.style.display = "none"
  })
}


// initial invocation, rendering of pets for app
fetchPets()
