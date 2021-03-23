const profile = document.querySelector('div#profile')
/********************************/
/********************************/
function Fetcher(url, http, data = null ,id = null) {

    let fetchURL = url    

    if (http === 'POST' || http === 'PATCH' || http === 'DELETE') fetchURL = `${url}/${id}`

    const HEADERS = {
        method: http,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }

    return fetch(fetchURL, HEADERS)
            .then(res => res.json())
}
/********************************/
    /**********DONE**************
/********************************/
        
fetch('http://localhost:3000/travelers/1')
    .then(res => res.json())
    .then(data => renderTravel(data))

function renderTravel(data) {
    console.log(data)
    const img = profile.querySelector('img '),
        h2 = profile.querySelector('h2'),
        em = profile.querySelector('em'),
        p = profile.querySelector('p')
    
    img.src = data.photo
    h2.textContent = data.name
    em.textContent = data.nickname
    p.textContent = `${data.likes} likes`
}

profile.addEventListener('click', e => {
    e.preventDefault()
    if (e.target.matches('button.like-button')) {
        const p = e.target.previousElementSibling 
        const likes = parseInt(p.textContent) + 1
        p.textContent = `${likes} likes`

         Fetcher('http://localhost:3000/travelers/', 'PATCH', { likes }, 1)
       
    }
})
/********************************/
/********************************/
const container = document.querySelector('#animals')

fetch('http://localhost:3000/animalsightings')
    .then(res => res.json())
    .then(data => data.forEach(d => {
        renderSightings(d)
    }))

function renderSightings(data) {
    const li = document.createElement('li')
    li.dataset.id = data.id

    li.innerHTML = `
        <p>${data.description}</p>
            <img src='${data.photo}' alt='${data.species}'/>
            <a href='video url here' target='_blank'>Here's a video about the {species here} species!</a>
        <p class='likes-display'>${data.likes} Likes</p>
        <button class="like-button" type="button">Like</button>
        <button class="delete-button" type="button">Delete</button>
        <button class="toggle-update-form-button" type="button">Toggle Update Form</button>
        <form class="update-form" style="display: none;">
          <input type="text" value="${data.description}"/>
          <input type="submit" value="Update description">
        </form>
    `
    container.append(li)
}

container.addEventListener('click', e => {

    if (e.target.matches('button.like-button')) {
        const p = e.target.previousElementSibling
        const id = p.parentNode.dataset.id
        const likes = 1 + parseInt(p.textContent)
        p.textContent = `${likes} Likes`

        Fetcher('http://localhost:3000/animalsightings', 'PATCH', { likes }, id)
    
    } else if (e.target.matches('button.delete-button')) {
        const parent = e.target.parentNode.dataset.id
        e.target.parentNode.remove()
        fetch(`http://localhost:3000/animalsightings/${parent}`, {method: 'DELETE'})

    } else if (e.target.matches('button.toggle-update-form-button')) {
        
        const form = e.target.nextElementSibling
        const parent = form.parentNode
        form.style.display = form.style.display === 'block' ? 'none' : 'block'

        form.addEventListener('submit', e => {
            e.preventDefault()
            const p = parent.firstChild
            const description = e.target[0].value
            p.textContent = description
            Fetcher('http://localhost:3000/animalsightings', 'PATCH', {description}, parent.dataset.id)
            e.target.reset()
        })
    }
})

/********************************/
/********************************/
const newForm = document.querySelector('#new-animal-sighting-form')

newForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const newSight = {
        species: e.target[0].value,
        video: e.target[1].value,
        photo: e.target[2].value,
        description: e.target[3].value
    }

    Fetcher('http://localhost:3000/animalsightings', 'POST', newSight)
        .then(data => renderSightings(data))

    e.target.reset()
})
