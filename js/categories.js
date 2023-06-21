function menuCategories() {
  const response = fetch("http://localhost:5000/api/categories/");
response
  .then((data) => {
    return data.json();
  })
  .then((resp) => {
    let list = "";
    let categoriesList = [];
    for (let i = 0; i < resp.data.length; ++i) {
      let element = resp.data[i];
      const { _id, name, image, productCount } = element;
      let category = new Category(_id, name, image, productCount);
      categoriesList.push(category);
    }
    let categories = new Categories(categoriesList);
    localStorage.setItem("categories", JSON.stringify(categories));
    //display categoies menu
    document.getElementById("categories-menu").innerHTML =
      categories.getMenuCategories();

    // display menu section
    document.getElementById("categories-section").innerHTML =
      categories.getSortedCategories();
  });
}

menuCategories();

class Categories {
  _categoryList;

  constructor(categoriesList) {
    this._categoryList = categoriesList;
  }
  getMenuCategories() {
    let list = "";
    for (let i = 0; i < this._categoryList.length; ++i) {
      list += this._categoryList[i].getHtmlMenuCategory();
    }
    return list;
  }

  getSortedCategories() {
    let sortedCategories = this._categoryList;
    for (let i = 0; i < sortedCategories.length; ++i) {
      for (let j = 0; j < sortedCategories.length - 1; ++j) {
        if (
          sortedCategories[j].getProductCount() <
          sortedCategories[j + 1].getProductCount()
        ) {
          let temp = sortedCategories[j];
          sortedCategories[j] = sortedCategories[j + 1];
          sortedCategories[j + 1] = temp;
        }
      }
    }
    let categoriesSection = "";
    for (let i = 0; i < 4; ++i) {
      categoriesSection += sortedCategories[i].getHtmlSectionCategory();
    }
    return categoriesSection;
  }
}

class Category {
  _id;
  _name;
  _image;
  _productCount;

  constructor(id, name, image, productCount) {
    this._id = id;
    this._name = name;
    this._image = image;
    this._productCount = productCount;
  }

  getHtmlMenuCategory() {
    return `<a href="" class="nav-item nav-link">${this._name}</a>`;
  }

  getHtmlSectionCategory() {
    return `
    <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
     <a class="text-decoration-none" href="">
      <div class="cat-item d-flex align-items-center mb-4">
        <div class="overflow-hidden" style="width: 100px; height: 100px">
          <img class="img-fluid" src="${this._image}" alt="" />
        </div>
        <div class="flex-fill pl-3">
          <h6>${this._name}</h6>
          <small class="text-body">${this._productCount} Products</small>
        </div>
      </div>
    </a>
  </div>`;
  }

  getId() {
    return this._id;
  }
  getName() {
    return this._name;
  }
  getImage() {
    return this._image;
  }
  getProductCount() {
    return this._productCount;
  }
}

