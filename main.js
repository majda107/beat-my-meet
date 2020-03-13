// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const fs = require('fs')
// const robot = require("robotjs");
const path = require('path')

function typeText(text, current, callback) {
  callback(text[current])
  if(current < text.length - 1) {
    typeText(text, current + 1, callback)
  }
}

function waitForElements(contents, repeat, callback) {
  
  setTimeout(() => {
    console.log("FETCHING ELEMENTS ON PAGE!")
    contents.executeJavaScript('function main() { let q = document.evaluate("//*[contains(text(),\'Ask\')]", document, null, XPathResult.ANY_TYPE, null ); q = q.iterateNext(); if(q == null || q.getBoundingClientRect().x == 0) { return null; } let buttonBox = q.getBoundingClientRect(); let buttons = document.evaluate("//*[contains(@jsname, \'BOHaEe\')]", document, null, XPathResult.ANY_TYPE); console.log(buttons); console.log(buttonBox); return JSON.stringify({ button: buttonBox, input: document.querySelector(\'input\').getBoundingClientRect(), mic:buttons.iterateNext().getBoundingClientRect(), camera: buttons.iterateNext().getBoundingClientRect() }); } main();').then((value) => {
      console.log(value)
      if(value == null) {
        console.log("NO INPUT FOUND")
        waitForElements(contents, repeat, callback)
      } else {
        console.log("INPUT FOUND")

        setTimeout(() => {
          value = JSON.parse(value)
          callback(value.button, value.input, value.camera, value.mic)
        }, 2000) // ANIMATION SHIT
      }
    }) 
  }, repeat)
}


function createUsers(text, users, current, count, callback) {
  if(current >= count) {
    callback(users)
    return
  }

  console.log(` > Creating user... ${current}`)

  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })




  // and load the index.html of the app.
  mainWindow.loadURL("https://meet.google.com/eht-wzej-jgc")
  // mainWindow.webContents.openDevTools()

  mainWindow.setSize(500, 700)

  mainWindow.webContents.on('did-finish-load', ()=>{
    // let code = `document.getElementById("jd.anon_name").value = "Lol test"; let button = document.evaluate('//*[contains(text(),\'Ask to join\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; button.click()`;
    // let code = `const robot = require("robotjs"); robot.moveMouse(100, 100); document.getElementById("jd.anon_name").value = "Lol test";`;
    // mainWindow.webContents.executeJavaScript(code);
    // let code = fs.readFileSync("script.js", "utf-8")
    // mainWindow.webContents.executeJavaScript(code)
    console.log("Waiting")
    // setTimeout(() => {
    //   console.log("Sending input!")
    //   mainWindow.webContents.focus()
    //   // mainWindow.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'a'})
    //   // mainWindow.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'a'})
    //   mainWindow.webContents.executeJavaScript('function main() { let q = document.evaluate("//*[contains(text(),\'Ask\')]", document, null, XPathResult.ANY_TYPE, null ); q = q.iterateNext(); if(q == null) { return null; } let buttonBox = q.getBoundingClientRect(); console.log(buttonBox); return JSON.stringify({ button: buttonBox, input: document.querySelector(\'input\').getBoundingClientRect() }); } main();').then((value) => {
    //     console.log("JS EXECUTED!")
    //     console.log(value)
    //   })
    // //   mainWindow.webContents.sendInputEvent({type:'mouseDown', x:910, y: 440, button:'left', clickCount: 1});

    // //   let text = 'Matatko'
    // //   typeText(text, 0, function(letter) {
    // //     mainWindow.webContents.sendInputEvent({keyCode: letter, type: 'char'})
    // //   })

    // //   mainWindow.webContents.sendInputEvent({type:'mouseDown', x:940, y: 520, button:'left', clickCount: 1});
    // //   setTimeout(() => {
    // //     mainWindow.webContents.sendInputEvent({type:'mouseUp', x:940, y: 520, button:'left', clickCount: 1});
    // //     connectUser()
    // //     setTimeout(() => {
    // //       mainWindow.close()
    // //     }, 10000)
    // //   }, 100)
      
    // }, 3000)

    waitForElements(mainWindow.webContents, 500, (button, input, camera, mic) => {
      mainWindow.webContents.focus()

      mainWindow.webContents.sendInputEvent({type:'mouseDown', x:mic.x+10, y: mic.y+10, button:'left', clickCount: 1});
      mainWindow.webContents.sendInputEvent({type:'mouseUp', x:mic.x+10, y: mic.y+10, button:'left', clickCount: 1});

      mainWindow.webContents.sendInputEvent({type:'mouseDown', x:camera.x+10, y: camera.y+10, button:'left', clickCount: 1});
      mainWindow.webContents.sendInputEvent({type:'mouseUp', x:camera.x+10, y: camera.y+10, button:'left', clickCount: 1});

      mainWindow.webContents.sendInputEvent({type:'mouseDown', x:input.x+10, y: input.y+10, button:'left', clickCount: 1});
      mainWindow.webContents.sendInputEvent({type:'mouseUp', x:input.x+10, y: input.y+10, button:'left', clickCount: 1});

      setTimeout(() => {
        typeText(text, 0, function(letter) {
          mainWindow.webContents.sendInputEvent({keyCode: letter, type: 'char'})
        })

        users.push({ window: mainWindow, button: button })
        createUsers(text, users, current + 1, count, callback)
  
        // setTimeout(() => {
        //   mainWindow.webContents.sendInputEvent({type:'mouseDown', x:button.x + 10, y: button.y + 10, button:'left', clickCount: 1});
        //   setTimeout(() => { 
        //     mainWindow.webContents.sendInputEvent({type:'mouseUp', x:button.x + 10, y: button.y + 10, button:'left', clickCount: 1});
        //     connectUser(text)
        //   }, 100) 
        // }, 300)
        
      }, 200)
    })
  });
}

function connectUsers(users) {
  for(let user of users) {
    user.window.focus()
    user.window.webContents.sendInputEvent({type:'mouseDown', x:user.button.x + 10, y:user.button.y + 10, button:'left', clickCount: 1});
    user.window.webContents.sendInputEvent({type:'mouseUp', x:user.button.x + 10, y:user.button.y + 10, button:'left', clickCount: 1});
  }
}

function nestedJoin(batch = 1) {
  createUsers("Pavel Pesat lol3", [], 0, batch, (users) => {
    connectUsers(users)
    for(let user of users) {
      setTimeout(() => {

        nestedJoin(batch)

        // user.window.webContents.executeJavaScript('function main() { let children = document.body.children; for(let child of children) { if(child.tagName == "DIV") { console.log("Removing child..."); console.log(child); child.remove(); } } } main();')
        // user.window.webContents.executeJavaScript('function checkChildren() { console.log("Searching for kids..."); for(let child of document.body.children) { if(child.tagName == "AUDIO") { setTimeout(() => { removeChildren(); }, 15000); return; } } setTimeout(() => checkChildren(), 500) } function removeChildren() { for(let child of document.body.children) { if(child.tagName == "DIV") { console.log("Removing child..."); console.log(child); child.remove(); } } } function main() { checkChildren() } main();')
        user.window.webContents.executeJavaScript('function pee(delay) { let sel = document.querySelectorAll(".kFwPee"); if(sel.length >= 1) { sel[0].remove() } else { setTimeout(() => { pee(delay); }, delay) }  } function main() { pee(500); } main();')
      }, 5000)
    }
  })
}

function createWindow () {
  // Create the browser window.
  // for(let i = 0; i < 4; i++) {
  //   connectUser("Matatko lol")
  // }


  // createUsers("Matatko lol2", [], 0, 15, (users) => {
  //   console.log(`${users.length} users created!`)
  //   connectUsers(users)
  // })

   nestedJoin(1)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
