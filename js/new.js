const id = Math.floor(new Date().getTime()).toString(36)
const back_btn = document.getElementById('back')
const save_btn = document.getElementById('savebtn')
const notes = document.getElementById('notes')
const title = document.getElementById('title')
let saved = false

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
	}
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

save_btn.addEventListener('click', async (event) => {
	chrome.storage.sync.get(['notes'], async function (items) {
		let newnotes = {
			id: id,
			title: title.value,
			notes: notes.value,
			timestamp: new Date().toString().split('GMT')[0],
			timestampraw: Date().now,
		}
		console.log(items)
		if (items.notes[0]) {
			let array = items.notes
			array.push(newnotes)
			console.log(array)
			await storeData({
				notes: array,
			})
		} else {
			await storeData({
				notes: [
					{
						id: id,
						title: title.value,
						notes: notes.value,
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

async function storeData(obj) {
	console.log(obj)
	await chrome.storage.sync.set(obj, function () {
		//  Data's been saved boys and girls, go on home
	})
}
