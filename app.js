//storage controller

//item controller
const ItemCtrl = (function() {
    //item constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //data structure / state
    const data = {
        items: [ 
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 0, name: 'Cookie', calories: 400},
            // {id: 0, name: 'Eggs', calories: 300},
        ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            //create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //calories to number
            calories = parseInt(calories);

            //create new item
            newItem = new Item(ID, name, calories);

            //add to items array;
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id) {
            let found = null;
            //loop through items
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            //loop through item to add calories
            data.items.forEach(function(item){
                total += item.calories;
            });
            //set total calories in data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }
})();

//ui controller
const UICtrl = (function() {
   const UISelectors = {
       itemList: '#item-list',
       addBtn: '.add-btn',
        updateBtn: '.update-btn',
       deleteBtn: '.delete-btn',
       backBtn: '.back-btn',
       itemNameInput: '#item-name',
       itemCaloriesInput: '#item-calories',
       totalCalories: '.total-calories'
   }

    return {
        populateItemList: function(items) {
            let html = '';
            
            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories}Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            });

            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add id
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }
    }
})();

//app controller
const App = (function(ItemCtrl, UICtrl) {
    const loadEventListeners = function() {
        //get UI selectors
        const UISelectors = UICtrl.getSelectors();
        //additem event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
    }

    const itemAddSubmit = function(e) {
        const input = UICtrl.getItemInput();
        //check for name and calories input
        if(input.name !== '' && input.calories !== ''){
            //add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);
           //add item to UI list
           UICtrl.addListItem(newItem);

           //get total calories
           const totalCalories = ItemCtrl.getTotalCalories();
           //add total calories to UI
           UICtrl.showTotalCalories(totalCalories);
           
           //clear input
           UICtrl.clearInput();
        }
        e.preventDefault();
        
    }

    const itemUpdateSubmit = function(e) {
        if(e.target.classList.contains('edit-item')){
            //get list item id
            const listId = e.target.parentNode.parentNode.id;

            //break into an array
            const listIdArr = listId.split('-');

            //get id
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);
            
            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    return {
        init: function() {
            //clear edit state / set initial stat
            UICtrl.clearEditState();

            //get items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                //populate list with items
            UICtrl.populateItemList(items);
            }

            //get total calories
           const totalCalories = ItemCtrl.getTotalCalories();
           //add total calories to UI
           UICtrl.showTotalCalories(totalCalories);
            
            
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

//initialize app
App.init()
