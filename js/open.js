const notesbox = document.getElementById('notes')
const title = document.getElementById('title')
const save_btn = document.getElementById('savebtn')
const back_btn = document.getElementById('back')
const delete_btn = document.getElementById('delete')
let Id
let saved = false

delete_btn.addEventListener('click', (event) => {
	if (confirm('Are you sure?') == true) {
		chrome.storage.sync.get(['notes'], async function (items) {
			if (items.notes) {
				let notes = items.notes
				notes.splice(
					notes.findIndex((a) => a.id === Id),
					1
				)
				await chrome.storage.sync.remove(['session'], function () {
					var error = chrome.runtime.lastError
					if (error) {
						console.error(error)
					}
				})
				await storeData({
					notes: notes,
				})
				location.href = '/html/popup.html'
			}
		})
	}
})

save_btn.addEventListener('click', async (event) => {
	chrome.storage.sync.get(['notes'], async function (items) {
		let newnotes = {
			id: Id,
			title: title.value,
			notes: notesbox.value,
			timestamp: new Date().toString().split('GMT')[0],
			timestampraw: Date().now,
		}
		console.log(items)
		if (items.notes[0]) {
			let array = items.notes
			array.splice(
				array.findIndex((a) => a.id === Id),
				1
			)
			array.push(newnotes)
			console.log(array)
			await storeData({
				notes: array,
			})
		} else {
			await storeData({
				notes: [
					{
						id: Id,
						title: title.value,
						notes: notesbox.value,
						timestamp: new Date().toString().split('GMT')[0],
						timestampraw: Date().now,
					},
				],
			})
		}
		await chrome.storage.sync.remove(['session'], function () {
			var error = chrome.runtime.lastError
			if (error) {
				console.error(error)
			}
		})
		saved = true
		alert('Saved!')
		location.href = '/html/popup.html'
	})
})

back_btn.addEventListener('click', async (event) => {
	if (confirm('By going back any unsaved data will be lost forever!') == true) {
		saved = true
		await chrome.storage.sync.remove(['session'], function () {
			var error = chrome.runtime.lastError
			if (error) {
				console.error(error)
			}
		})
		location.href = '/html/popup.html'
	}
})

const prev_sec = chrome.storage.sync.get(['open'], function (items) {
	console.log(items)
	if (items.open) open(items.open)
	chrome.storage.sync.remove(['open'], function () {
		var error = chrome.runtime.lastError
		if (error) {
			console.error(error)
		}
	})
})

function open(id) {
	console.log(id)
	Id = id
	chrome.storage.sync.get(['session'], function (items) {
		if (items.session) {
			title.value = items.session.title
			notesbox.value = items.session.notes
			setInterval(() => {
				if (saved === true) return
				storeData({
					session: {
						id: id,
						title: title.value,
						notes: notes.value,
					},
				})
			}, 2000)
		} else {
			setInterval(() => {
				if (saved === true) return
				storeData({
					session: {
						id: id,
						title: title.value,
						notes: notes.value,
					},
				})
			}, 2000)
			chrome.storage.sync.get(['notes'], async function (items) {
				if (items.notes) {
					const notes = items.notes
					console.log(notes)
					notes.forEach((obj) => {
						if (obj.id === id) {
							title.value = obj.title
							notesbox.value = obj.notes
						}
					})
				}
			})
		}
	})
}
async function storeData(obj) {
	console.log(obj)
	await chrome.storage.sync.set(obj, function () {
		//  Data's been saved boys and girls, go on home
	})
}
