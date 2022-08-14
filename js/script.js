const saved_notes = document.getElementById('saved_notes')

chrome.storage.sync.get(['session'], function (items) {
	if (items.session) {
		open_note(items.session.id)
	}
})

getSavedNotes()
async function getSavedNotes() {
	chrome.storage.sync.get(['notes'], async function (items) {
		if (items.notes) {
			const notes = items.notes
			console.log(notes)
			const sorted = await notes.sort((a, b) => a.timestampraw - b.timestampraw)
			sorted.forEach((obj) => {
				createnoteobj(obj)
			})
		}
	})
}

function createnoteobj(obj) {
	const newDiv = document.createElement('div')
	newDiv.setAttribute('id', obj.id)
	newDiv.setAttribute('class', 'saved_note')
	const titleDiv = document.createElement('div')
	titleDiv.setAttribute('class', 'note_title')
	titleDiv.setAttribute('id', obj.id)
	titleDiv.innerHTML =
		'<div id="' +
		obj.id +
		'" class="title">' +
		obj.title +
		'</div>' +
		'<div id="' +
		obj.id +
		'" class="timestamp">' +
		obj.timestamp +
		'</div>'
	newDiv.appendChild(titleDiv)
	saved_notes.appendChild(newDiv)
}

// setTimeout(() => {
// 	var elements = document.getElementsByClassName('saved_note')
// 	for (var i = 0; i < elements.length; i++) {
// 		elements[i].addEventListener('click', open(elements[1].id), false)
// 	}
// }, 1000)

document.addEventListener(
	'click',
	function (event) {
		// If the clicked element doesn't have the right selector, bail
		if (
			!event.target.matches('.title') &&
			!event.target.matches('.saved_note') &&
			!event.target.matches('.timestamp') &&
			!event.target.matches('.note_title')
		)
			return

		// Don't follow the link
		event.preventDefault()

		// Log the clicked element in the console
		open_note(event.target.id)
	},
	false
)

function open_note(id) {
	console.log(id)
	storeData({
		open: id,
	})
	location.href = '/html/open.html'
}

async function storeData(obj) {
	console.log(obj)
	await chrome.storage.sync.set(obj, function () {
		//  Data's been saved boys and girls, go on home
	})
}
