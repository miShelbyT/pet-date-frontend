//DOM ELEMENTS

const petContainer = document.querySelector("#pet-collection")
const modal = document.querySelector(".modal-container")
const modalContent = document.querySelector(".modal-content")
let pdForm = modalContent.querySelector("form")
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
async function fetchPets() {
  let resp = await fetch(petUrl)
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  let result = await resp.json()
  return result.forEach(pet => {
    renderPet(pet)
    simplePetArray.push(pet.name)
  })
}

// POST new Pet
async function createPet(addPetObj) {
  let resp = await fetch(petUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(addPetObj)
  })
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }
  let newPet = await resp.json()
  console.log(newPet)
  // pet returns undefined in console even though the fetch went through successfully and data renders fine in new pet card. data will not render in modal until i refresh the page
  return renderPet(newPet)
    .catch((error) => {
      console.error('Error:', error);
    });
}


// GET Pet/PD Data to render onto Modal
function petDetails(id) {
  fetch(`${petUrl}/${id}`)
    .then((resp) => resp.json())
    .then((petObj) => {
      renderPetOnModal(petObj)
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
    .then(pdObj => {
      // console.log(pdObj)
      createPlaydate(pdObj)
    })
}

//  Playdate PATCH/update
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


/***************** Event Listeners ***********************/

// render modal from Pet Deets button
petContainer.addEventListener("click", (event) => {
  if (event.target.matches(".deets")) {
    let petId = event.target.dataset.id
    // console.log(petId)
    toggleModal()
    petDetails(petId)
  }
})

// show PD form
modalContent.addEventListener("click", (event) => {
  if (event.target.matches("#pd-button")) {
    console.log("hi")
    const petId = event.target.dataset.id
    // passing this pet id for pd obj for fetch/POST
    createPlayDateForm(petId)
  }
})

// POST new PD -- need a separate event listener to update PD? or no?
if (pdForm) {
  pdForm.addEventListener("submit", event => {
    if (event.target.matches("#submit-pd")) {
      event.preventDefault()
      console.log("here we are")
      // const petOption = document.querySelector(`option[value=${friendInput.value}]`)
      console.log(form)
      pdObj = {
        pet_id: event.target.dataset.id,
        pet2_id: option.dataset.id.value,
        date: form.date.value,
        location: form.location.value
      }
      console.log(pdObj)

      pdPost(pdObj)
    } else if(event.target.matches("update-btn")) {
      event.preventDefault()
      console.log("here we are again")
      // const petOption = document.querySelector(`option[value=${friendInput.value}]`)
      console.log(form)
      pdObj = {
        pet_id: event.target.dataset.id,
        pet2_id: option.dataset.id.value,
        date: form.date.value,
        location: form.location.value
      }
      console.log(pdObj)

      pdUpdate(pdObj)
    }
  })
}

//delete playdate button
modalContent.addEventListener("click", event => {
  if (event.target.matches(".pd-delete")) {
    console.log("delete")
    const id = event.target.dataset.id
    deletePlaydate(id)
  }
})

//event listener renders form for PD update
modalContent.addEventListener("click", event => {
  if (event.target.matches(".pd-update")) {
    console.log("hiii")
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
function renderPet(pet) {
  const petDiv = document.createElement("div")
  const petImg = document.createElement("img")
  const petName = document.createElement("h2")
  const petType = document.createElement("h4")
  const petButton = document.createElement("button")

  petDiv.className = "card"

  petName.textContent = pet.name
  petType.textContent = `Breed: ${pet.breed}`

  petButton.className = "deets"
  petButton.classList.add("btn-styles")

  petButton.textContent = "Pet Deets"
  petButton.dataset.id = pet.id


  petImg.src = pet.img
  petImg.alt = pet.name
  petImg.className = "pet-avatar"

  petDiv.append(petImg, petName, petType, petButton)

  petContainer.append(petDiv)
}


// renders Pet's info onto modal content
function renderPetOnModal(petObj) {

  modalContent.innerHTML = ""

  modalContent.innerHTML = `
  <div class="pet-info">
    <div class="pet-img">
      <img src=${petObj.img}>
    </div>  
        <h2>Name: ${petObj.name}</h2>
        <br>
        <h3>Breed: ${petObj.breed}</h3>
        <br>
        <h3>Age: ${petObj.age > 1 ? `${petObj.age} years old` : `${petObj.age} year old`}</h3>
        <br>
        <h3>Personality: ${petObj.temper}</h3>
        <br>
        <button data-id=${petObj.id} id="pd-button" class="btn-styles" "wanna-play"> Wanna Play? </button>
  </div>
  <div class="ul-div">
        <ul class="pd-list"> Playdate Schedule:
        </ul>
  </div>
  
  `
  playDates(petObj)

};


// renders playdate info onto modal content
function playDates(petObj) {
  if (petObj.playdates) {
    // assigning allDates to ul pet list
    allDates = modalContent.querySelector(".pd-list")

    petObj.playdates.forEach(playdate => {

      const li = document.createElement("li")
      li.dataset.id = playdate.id
      li.innerHTML = `
      Date: ${playdate.date}, Location: ${playdate.location}
      <button data-id=${playdate.id} class="pd-delete btn-styles"> Cancel Playdate</button>
      <button data-id=${playdate.id} data-pet=${playdate.pet_id} data-pet2=${playdate.pet2_id} data-date=${playdate.date} data-location=${playdate.location} class="pd-update btn-styles"> Update Playdate</button>
      `

      allDates.append(li)
    })
  }

}

// POST new playdate
function createPlaydate(pdObj) {
  // assigning allDates to ul pet list
  allDates = modalContent.querySelector(".pd-list")

  const li = document.createElement("li")
  li.dataset.id = pdObj.id
  li.innerHTML = `Date: ${pdObj.date}, Location: ${pdObj.location}
  <button data-id=${pdObj.id} class="pd-delete btn-styles"> Cancel Playdate</button>
  <button data-id=${pdObj.id} class="pd-update btn-styles"> Update Playdate</button>
  `

  allDates.append(li)
}


// PATCH to update playdate
function updatePD(playdateObj) {
  li = document.querySelector(`li[data-id="${playdateObj.id}"]`)
  li.innerHTML = `Date: ${pdObj.date}, Location: ${pdObj.location}
  <button data-id=${pdObj.id} class="pd-delete btn-styles"> Cancel Playdate</button>
  <button data-id=${pdObj.id} class="pd-update btn-styles"> Update Playdate</button>
  `
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

// show pd form on modal
function createPlayDateForm(petId) {

  const form = document.createElement("form")

  form.innerHTML = `
  <input type="date" id="date">
  <select id="friends" name="friendlist">
  <input id="location" name="location" placeholder="enter location...">
  <button id="submit-pd" class="btn-styles" data-id=${petId} >Create Playdate</button>
`

  const select = form.querySelector("#friends")


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

    select.append(petOption)
  }

  modalContent.append(form)

}

//Render Form To Update PD 
function playdateUpdate(oldPDObj) {
  const form = document.createElement("form")
  const locationInput = document.createElement("input")
  const dateInput = document.createElement("input")
  const submitBtn = document.createElement("button")


  submitBtn.id = "submit-pd"
  submitBtn.className = "btn-styles"
  submitBtn.classList.add("update-btn")
  submitBtn.textContent = "Confirm/Update Playdate"

  locationInput.id = "location"
  locationInput.value = oldPDObj.location

  dateInput.type = "date"
  dateInput.value = oldPDObj.date
  dateInput.id = "date"
  form.append(dateInput, locationInput, submitBtn)
  modalContent.append(form)

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
      .catch(e => {
        console.log('There has been a problem with your fetch operation: ' + e.message);
      });

    petForm.remove()
  })
}


// initial invocation, rendering of pets for app
fetchPets()
  .catch(e => {
    console.log('There has been a problem with your fetch operation: ' + e.message);
  });