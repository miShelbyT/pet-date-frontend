//DOM ELEMENTS

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


/*********** Fetches ***************/
// PET FETCHES

// GET all pets
function fetchPets() {
  fetch(petUrl)
    .then((resp) => resp.json())
    .then((petArray) => {
      petArray.forEach((pet) => {
        renderPets(pet)
        simplePetArray.push(pet.name)
      })
    })
}

// POST new Pet
function createPet(addPetObj) {
  fetch(petUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(addPetObj)
  })
    .then(response => response.json())
    .then(newPetObj => {
      console.log(newPetObj)
      renderPets(newPetObj)
    })
}


// GET Pet/PD Data to render onto Modal
function petDetails(id) {
  fetch(`${petUrl}/${id}`)
    .then((resp) => resp.json())
    .then((petObj) => {
      renderPet(petObj)
    });
};


// PLAYDATE FETCHES

// Playdate POST
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
    .then(pdObj => createPlaydate(pdObj))
}

//  Playdate PATCH
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
    .then(updatedPD => updatePD(updatedPD))
}

// Delete Playdate
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
  if (event.target.matches(".pd-update")) {
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
function renderPets(pet) {
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
function renderPet(petObj) {

  modalContent.innerHTML = ""

  modalContent.innerHTML = `
  <img src=${petObj.img}>
  <h2>Name: ${petObj.name}</h2>
  <h3>Breed: ${petObj.breed}</h3>
  <h3>Age: ${petObj.age > 1 ? `${petObj.age} years old` : `${petObj.age} year old` }</h3>
  <h3>Personality: ${petObj.temper}</h3>
  <ul class="pd-list"> Playdates:
  </ul>
  <button data-id${petObj.id} id="pd-button" class="btn-styles" "wanna-play"> Wanna Play? </button>
  `
  playDates(petObj)

};


// Iterates thru to render playdate info onto modal content
function playDates(petObj) {
  if (petObj.playdates) {
    allDates = modalContent.querySelector(".pd-list")

    petObj.playdates.forEach(playdate => {

      const date = document.createElement("li")
      date.dataset.id = playdate.id
      date.innerHTML = `
      Date: ${playdate.date}, Location: ${playdate.location}
      <button data-id=${playdate.id} class="pd-delete btn-styles"> Cancel Playdate</button>
      <button data-id=${playdate.id} data-pet=${playdate.pet_id} data-pet2=${playdate.pet2_id} data-date=${playdate.date} data-location=${playdate.location} class="pd-update btn-styles"> Update Playdate</button>
      `

      allDates.append(date)
    })
  }

}

// POST new playdate
function createPlaydate(pdObj) {
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
}


// PATCH to update playdate
function updatePD(playdateObj) {
  li = document.querySelector(`li[data-id="${playdateObj.id}"]`)
  li.textContent = `Date: ${playdateObj.date}, Location: ${playdateObj.location}`

  const deleteBtn = document.createElement("button")
  const updateBtn = document.createElement("button")

  deleteBtn.textContent = "Cancel Playdate"
  deleteBtn.dataset.id = playdateObj.id
  deleteBtn.className = "btn-styles"
  deleteBtn.classList.add("pd-delete")

  updateBtn.textContent = "Update Playdate"
  updateBtn.dataset.id = playdateObj.id
  updateBtn.className = "pd-update"
  updateBtn.classList.add("btn-styles")

  li.append(deleteBtn, updateBtn)
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

  for (i = 0; i < simplePetArray.length; i++) {
    const petOption = document.createElement('option')

    if (simplePetArray[i].includes(' ')) {
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
  console.log(oldPDObj)
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

  submitBtn.addEventListener("click", event => {
    event.preventDefault()

    newpdObj = {
      id: oldPDObj.id,
      pet_id: oldPDObj.petid,
      pet2_id: oldPDObj.pet2_id,
      date: form.date.value,
      location: form.location.value
    }

    pdUpdate(newpdObj)
    form.remove()
  })

}


const renderPetForm = () => {
  const petForm = document.createElement("form")

  petForm.innerHTML = `
  <input id="name" placeholder="Pet Name">
  <input id="temper" placeholder="Pet's Personality">
  <input id="age" type="number" placeholder="Pet's Age">
  <input id="breed" placeholder="Pet's Breed">
  <input id="gender" placeholder="Pet's Gender">
  <input id="species" placeholder="Pet's Species">
  <input id="image" placeholder="Url link of your Pet">
  <button class="submit-btn btn-styles" type="submit"> Add Pet </button>
  `
  

  navSpan.append(petForm)

  petForm.addEventListener("submit", event => {
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

    petForm.remove()
  })
}


// initial invocation, rendering of pets for app
fetchPets()
