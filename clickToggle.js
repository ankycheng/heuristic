import { name, intersects, disableToggle, objNames, specialNamesToggles, data } from "./main.js";
import { tabManager } from './tabManager.js'
import { changeMessage, changePopupZ } from './main.js'


export function clickToggle() {
	if (disableToggle) {
		console.log(
			'clickToggle is disabled while pointerlock controls are disabled'
		)
		return
	} else {
		// console.log('intersects length: ', intersects.length)
		// console.log('name: ', name)
		// console.log(
		// 	'index of name to string: ',
		// 	// objNames.indexOf(name.toString())
		// )
		// console.log(
		// 	'first if statement result: ',
	
		// 	intersects.length == 0 || objNames.indexOf(name.toString()) == -1
		// )
		//i only need one of these to run the function?
		if (intersects.length == 0) {
			console.log('clicking the background bc of intersects')
			for (var i = 0; i < specialNamesToggles.length; i++) {
				specialNamesToggles[i] = false
			}
			tabManager()
		} else if (objNames.indexOf(name.toString()) == -1) {
			console.log('clicking the background bc of name')
			for (var i = 0; i < specialNamesToggles.length; i++) {
				specialNamesToggles[i] = false
			}
			tabManager()
		} else if (intersects.length > 0) {
			console.log('clicking something')
			for (var i = 0; i < objNames.length; i++) {
				let objName = objNames[i]
				console.log(
					'obj name: ',
					objName,
					'name string: ',
					name.toString,
					'name: ',
					name
				)
				if (objName == name) {
					if (specialNamesToggles[i]) {
						specialNamesToggles[i] = false
					} else {
						specialNamesToggles[i] = true
					}
					console.log('visibility array: ', specialNamesToggles)
					tabManager()
					if (i == 0 && document.getElementById("wip").style.display == "flex") {
						changeMessage("press esc to leave")
					} else if (i == 1 && document.getElementById("wip").style.display == "flex") {
						changeMessage("use wasd or arrow keys to move")
					} else if (i == 2 && document.getElementById("wip").style.display == "flex") {
						changeMessage("contact info popup toggled")
					}
					//next i need to uh change the message to click anywhere to close?
					changePopupZ(objName, data)
				} 				
			}
		}
	}
}