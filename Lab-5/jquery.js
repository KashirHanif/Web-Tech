let allProducts = [];
let editMode = false;
let editProductId = null;

$(function () {
  getProducts();
  $("#saveBtn").on("click", addOrUpdateProduct);
  $(document).on("click", ".btn-edit", editProduct);
  $(document).on("click", ".btn-delete", deleteProduct);
});

function renderProducts(list) {
  const productList = $("#productList");
  productList.empty();

  if (!list || list.length === 0) {
    productList.append("<p class='placeholder'>No products yet. Add one above!</p>");
    return;
  }

  for (const product of list) {
    const card = `
      <div class="product-card">
        <div>
          <img height="60" width="100" src="${product.image}" />
          <h4>Title: ${product.title}</h4>
          <h4>Price: $${product.price}</h4>
          <h4>Category: ${product.category}</h4>
          <h4>Description: ${product.description}</h4>
        </div>
        <div>
          <button class="btn btn-edit" data-id="${product.id}">Edit</button>
          <button class="btn btn-delete" data-id="${product.id}">Delete</button>
        </div>
      </div>`;
    productList.append(card);
  }
}

function getProducts() {
  $.ajax({
    url: "https://fakestoreapi.com/products",
    method: "GET",
    success: function (data) {
      allProducts = data;
      renderProducts(allProducts);
    },
    error: function () {
      console.log("Error fetching products");
    },
  });
}

function addOrUpdateProduct() {
  const title = $("#title").val();
  const price = $("#price").val();
  const category = $("#category").val();
  const description = $("#description").val();
  const image = $("#image").val();

  if (!title || !price || !category || !description || !image) {
    alert("Please fill all fields");
    return;
  }

  if (editMode) {
    // UPDATE (local + fake PUT)
    const idNum = Number(editProductId);
    const updated = { id: idNum, title, price: parseFloat(price), category, description, image };

    $.ajax({
      url: `https://fakestoreapi.com/products/${idNum}`,
      method: "PUT",
      data: JSON.stringify(updated),
      contentType: "application/json",       
      success: function (resp) {
        console.log("Response of updating product:", resp); // often {id: 1} from FakeStore

        const idx = allProducts.findIndex(p => p.id === idNum);
        if (idx !== -1) allProducts[idx] = updated;        
        renderProducts(allProducts);                       

        alert("Product updated successfully!");
        $("#productForm")[0].reset();
        $("#saveBtn").text("Add Product");
        editMode = false;
        editProductId = null;
      },
      error: function () {
        alert("Error updating product!");
      }
    });
    return;
  }


  const maxId = allProducts.length ? Math.max(...allProducts.map(p => p.id)) : 0;
  const newProduct = {
    id: maxId + 1,
    title,
    price: parseFloat(price),
    category,
    description,
    image
  };

  $.ajax({
    url: "https://fakestoreapi.com/products",
    method: "POST",
    data: JSON.stringify(newProduct),
    contentType: "application/json",
    success: function (resp) {
      console.log("Response of adding product:", resp);
      allProducts.push(newProduct);       // keep local state
      renderProducts(allProducts);        // refresh UI
      alert("Product added successfully!");
      $("#productForm")[0].reset();
    },
    error: function () {
      alert("Error adding product!");
    }
  });
}

function editProduct() {
  const productId = Number($(this).attr("data-id"));
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  $("#title").val(product.title);
  $("#category").val(product.category);
  $("#price").val(product.price);
  $("#description").val(product.description);
  $("#image").val(product.image);

  $("#saveBtn").text("Update Product");
  editMode = true;
  editProductId = productId;
}

function deleteProduct() {
    let productId = Number($(this).attr("data-id"));
    $.ajax({
        url:`https://fakestoreapi.com/products//${productId}`,
        method: "DELETE",
        success: function(response) {
           allProducts = allProducts.filter(p => p.id !== productId);
           renderProducts(allProducts);
           alert("Product deleted successfully!");
           console.log("Response of deleting product:", response);
        },
        error: function() {
            console.log("Error deleting product");
        }
    })
}
