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
    productList.append("<p>No products found. Add one above.</p>");
    return;
  }

  for (const p of list) {
    const card = `
      <div class="border rounded p-3 mb-3">
        <div class="d-flex">
          <img src="${p.image}" class="product-image">
    
          <div class="flex-grow-1">
            <h5 class="mb-1">${p.title}</h5>
            <p class="mb-1"><strong>Price:</strong> $${p.price}</p>
            <p class="mb-1"><strong>Category:</strong> ${p.category}</p>
            <p class="mb-0"><strong>Description:</strong> ${p.description}</p>
          </div>
          
          <div class="ms-2">
            <button class="btn btn-sm btn-success mb-2 btn-edit" data-id="${p.id}">Edit</button>
            <button class="btn btn-sm btn-danger btn-delete" data-id="${p.id}">Delete</button>
          </div>
        </div>
      </div>
    `;

    productList.append(card);
  }
}

function getProducts() {
  const productList = $("#productList");
  productList.html("<h2 class='mb-3'>Products</h2><p>Loading...</p>");

  $.ajax({
    url: "https://fakestoreapi.com/products",
    method: "GET",
    success: function (data) {
      allProducts = data;
      renderProducts(allProducts);
    },
    error: () => {
      productList.html("<h2 class='mb-3'>Products</h2><p class='text-danger'>Failed to load products.</p>");
      console.log("Error fetching products");
    }
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
    const idNum = Number(editProductId);
    const updated = { id: idNum, title, price: parseFloat(price), category, description, image };

    $.ajax({
      url: `https://fakestoreapi.com/products/${idNum}`,
      method: "PUT",
      data: JSON.stringify(updated),
      contentType: "application/json",
      success: () => {
        const idx = allProducts.findIndex(p => p.id === idNum);
        if (idx !== -1) allProducts[idx] = updated;
        renderProducts(allProducts);
        alert("Product updated!");
        $("#productForm")[0].reset();
        $("#saveBtn").text("Add Product");
        editMode = false;
        editProductId = null;
      }
    });
    return;
  }

  const maxId = allProducts.length ? Math.max(...allProducts.map(p => p.id)) : 0;
  const newProduct = { id: maxId + 1, title, price: parseFloat(price), category, description, image };

  $.ajax({
    url: "https://fakestoreapi.com/products",
    method: "POST",
    data: JSON.stringify(newProduct),
    contentType: "application/json",
    success: () => {
      allProducts.push(newProduct);
      renderProducts(allProducts);
      alert("Product added!");
      $("#productForm")[0].reset();
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
  const productId = Number($(this).attr("data-id"));

  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  $.ajax({
    url: `https://fakestoreapi.com/products/${productId}`,
    method: "DELETE",
    success: () => {
      allProducts = allProducts.filter(p => p.id !== productId);
      renderProducts(allProducts);
      alert("Product deleted!");
    },
    error: () => alert("Error deleting product")
  });
}

