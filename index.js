/* 

When the page loads, the information about the traveler should display including their name, image, nickname, and number of likes.

- this works but is not scalable
*/
const profile = document.querySelector('#profile')

fetch(`http://localhost:3000/travelers/`)
    .then(res => res.json())
    .then(userData => user(userData))


function user(data) {
    // profile
    const img = profile.querySelector('img'),
    h2 = profile.querySelector('h2'),
    em = profile.querySelector('em')
    p = profile.querySelector('p')
    
    img.src = data[0].photo
    h2.textContent = data[0].name
    em.textContent = data[0].nickname
    p.textContent = `${data[0].likes} likes`

}
/* 
    ## Deliverable 4: Increase traveler likes

When the user clicks on the traveler's like button, the new number of likes should display on the page without reloading the page. The new number of likes should persist (if the page reloads, the new number of likes should still display).


*/
profile.addEventListener('click', (e) => {
    e.stopImmediatePropagation()
    if (e.target.matches('button.like-button')) {
        const likes = e.target.previousElementSibling
        const like = 1+parseInt(likes.textContent)
        likes.textContent = `${like} likes`

        /* 
            this is not dynamic and I undertand that
        */
        fetch('http://localhost:3000/travelers/1', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({likes: like})
        })
    }
})



/* 

## Deliverable 2: Show animal sightings upon page load

When the page loads, each animal sighting of the travler should appear on the page in the `ul#animals` section. Each animal sighting should look like:

*/
fetch(`http://localhost:3000/animalsightings/`)
.then(res => res.json())
.then(data => renderAnimal(data))

const ul = document.querySelector('#animals')

const renderAnimal = (data) => {
    
    for (const key of data) {
        const li = document.createElement('li')
        li.dataset.id = key.id

        console.log(key)
        li.innerHTML = `
            <p>{description here}</p>
            <img src='${key.photo}' alt='${key.species}'/>
            <a href='video url here' target='_blank'>Here's a video about the %${key.species} species!</a>
            <p class='likes-display'>${key.likes} Likes</p>
            <button class="like-button" type="button">Like</button>
            <button class="delete-button" type="button">Delete</button>
            <button class="toggle-update-form-button" type="button">Toggle Update Form</button>
            <form class="update-form" style="display: none;">
                <input type="text" value="${key.description}"/>
                <input type="submit" value="Update description">
            </form>
        `
            ul.append(li)
    }
}

/* 
    ## Deliverable 3: Add a new animal sighting

When the user submits the form to add a new animal sighting post, the animal sighting should render on the page without reloading and should persist (it sohuld still be visible if the page reloads).Your animal sighting object must have a `travelerId` key with a value of `1` for the app to work properly.

*/

const form = document.querySelector('form#new-animal-sighting-form')

form.addEventListener('submit', (e) => {
    
    e.preventDefault()

    const iO = e.target[0].value
    const iT = e.target[1].value
    const iTh = e.target[2].value
    const iF = e.target[3].value

    const obj = {
        species: iO,
        link: iT,
        photo: iTh,
        description: iF
    }

    fetch('http://localhost:3000/animalsightings', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(newAnimal => renderAnimal(newAnimal))
    
    e.target.reset()

})
/* 

## Deliverable 5: Like an animal sighting

When the user clicks on an animal sighting's like button, the new number of likes for that animal should display on the page without reloading the page. The new number of likes should persist (if the page reloads, the new number of likes should still display).

*/

ul.addEventListener('click', (e) => {
    if (e.target.matches('button.like-button')) {
        const li = e.target.closest('li').dataset.id
        const likes = e.target.previousElementSibling
        const like = 1+parseInt(likes.textContent)
        likes.textContent = `${like} Likes`

        console.log(likes)
        console.log(li)
        /* 
            this is not dynamic and I undertand that
        */
       
            fetch(`http://localhost:3000/animalsightings/${li}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ likes: like })
            })
    }
})