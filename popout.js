// Deep Shah
// August 22nd, 2022
// Simple chrome extension to write your daily tasks. Saves in local storage so refreshing or closing the browser or extension will keep your todo's in place.

document.querySelector('.create-todo').addEventListener('click', function() { // When the new item button is clicked, the input area and save button are displayed
    document.querySelector('.new-item').style.display='block';
});

document.querySelector('.new-item button').addEventListener('click', function() { // When the save button is clicked, the following happens...

    let itemName = document.querySelector('.new-item input').value; // Task that is entered in the input area

    if(itemName != '') {

        let itemsStorage = localStorage.getItem('todo-items'); // Gets the inputted task which needs to be stored in local storage

        if (itemsStorage == null) { // Verifies that the items storage is not null, but if it is, we need to change it to make it non blank
            itemsStorage = '[]'; // If this stayed null, nothing would be able to push into the items array
        }

        let itemsArr = JSON.parse(itemsStorage); // Converts string to JavaScript object
        itemsArr.push({"item":itemName, "status":0}); // Status is 0 initially because it is not marked as complete
        saveItems(itemsArr); 
        getItems(); 
        document.querySelector('.new-item input').value=''; // If we want to add another item, this ensures that the previous item's value is not stuck in the input text area (thus, it will be blank when new item button is clicked again)
        document.querySelector('.new-item').style.display='none'; // Once the item is saved, the input area box and the save button will be hidden

    }
});

function getItems() { // Calls the local storage to get the items and decode them

    const itemsList = document.querySelector('ul.todo-items'); // Gets the tasks
    itemsList.innerHTML = ''; // The innerHTML property sets the HTML content of an element 
    let newItemHTML = ''; 

    try {

        let itemsStorage = localStorage.getItem('todo-items'); // Gets the inputted task which needs to be stored in local storage
        let itemsArr = JSON.parse(itemsStorage); // Converts string to JavaScript object

        for (let i = 0; i < itemsArr.length; i++) {

            let status = '';
            if (itemsArr[i].status == 1) { 
                status = 'class="done"'; // Status of 1 means that the item is marked as complete
            }
            
            newItemHTML += `<li data-itemindex="${i}" ${status}> 
            <span class="item">${itemsArr[i].item}</span> 
            <div><span class="itemComplete">✅</span><span class="itemDelete">🗑</span></div>
            </li>`;
            
        }

        itemsList.innerHTML = newItemHTML;
        let itemsListUL = document.querySelectorAll('ul li'); // All the list items added

        for (let i = 0; i < itemsListUL.length; i++) {

            itemsListUL[i].querySelector('.itemComplete').addEventListener('click', function() { // When the green check mark emoji is clicked, the itemComplete function is called
                let index = this.parentNode.parentNode.dataset.itemindex;
                itemComplete(index);
            });

            itemsListUL[i].querySelector('.itemDelete').addEventListener('click', function() { // When the garbage emoji is clicked, the itemDelete function is called
                let index = this.parentNode.parentNode.dataset.itemindex;
                itemDelete(index);
            });

        }

    } catch (e) {

    }

}

function itemComplete(index) { // What happens when the green check mark emoji is clicked?

    let itemsStorage = localStorage.getItem('todo-items'); // Gets the inputted task which needs to be stored in local storage
    let itemsArr = JSON.parse(itemsStorage); // Converts string to JavaScript object
    itemsArr[index].status = 1; // Status changing to 1 means that the item at the index is now marked as complete 
    saveItems(itemsArr); // Once we use this function, the line going through the task will save into local storage as well
    document.querySelector('ul.todo-items li[data-itemindex="'+index+'"]').className='done'; // The value of the task at this index is set to done and there will be a line going through this task

}

function itemDelete(index) { // What happens when the garbage emoji is clicked?

    let itemsStorage = localStorage.getItem('todo-items'); // Gets the inputted task which needs to be stored in local storage
    let itemsArr = JSON.parse(itemsStorage); // Converts string to JavaScript object
    itemsArr.splice(index, 1); // Removing the item at the index parameter from the array
    saveItems(itemsArr); // Once we use this function, when the extension/browser is refreshed, the item will no longer be in the list  
    document.querySelector('ul.todo-items li[data-itemindex="'+index+'"]').remove(); // Item is removed at this index and will no longer be in the list


}

function saveItems(obj) { // Whenever a change is made, the object passed in will be saved in local storage

    let str = JSON.stringify(obj); // Converts JavaScript object into a string
    localStorage.setItem('todo-items', str); // Now is when the task is saved to local stroage (before it was just getting the item)

}

getItems();