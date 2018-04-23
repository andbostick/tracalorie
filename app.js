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
       itemNameInput: '#item-name',
       itemCaloriesInput: '#item-calories'
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
        getSelectors: function() {
            return UISelectors;
        }
    }
})();

//app controller
const App = (function(ItemCtrl, UICtrl) {
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    const itemAddSubmit = function(e) {
        const input = UICtrl.getItemInput();
        //check for name and calories input
        if(input.name !== '' && input.calories !== ''){
            //add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);
           //add item to UI list
           UICtrl.addListItem(newItem);

           //clear input
           UICtrl.clearInput();
        }
        e.preventDefault();
        
    }

    return {
        init: function() {
            //get items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                //populate list with items
            UICtrl.populateItemList(items);
            }
            
            
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

//initialize app
App.init()
