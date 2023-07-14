function getIdOfBlog(blogId) {
  document.getElementById("id").value = blogId;
}

async function DeleteBlog() {
  const blogId = document.getElementById("id").value;
  console.log(blogId);

  const resp = await fetch(`${location.origin}/profile/${blogId}`, {
    method: "DELETE",
  });

  const data = await resp.json();
  console.log(data);

  if (resp.status === 200) {
    location.reload();
  } else {
    alert(data.message);
  }
}

async function getIdToUpdate(blogId) {
  // fetch the product information so I can show it in the form for update
  const resp = await fetch(`${location.origin}/profile/${blogId}`);

  const data = await resp.json();
  console.log(data);

  if (resp.status !== 200) {
    alert(data.message);
    return;
  }

  // IF IT GETS HERE THE INFORMATION WAS FOUND
  // SO UPDATE THE PRODUCT UPDATE FIELDS
  document.querySelector("input[name='updatedTitle']").value = data.blog.title;
  document.querySelector("input[name='updatedImage']").value = data.blog.image;
  document.querySelector("input[name='updatedCategory']").value =
    data.blog.category;
  document.querySelector("input[name='updatedContent']").value =
    data.blog.content;
}

async function updateProduct() {
  // RETRIEVE THE UPDATED INFO
  const update = {
    name: document.querySelector("input[name='updatedName']").value,
    img: document.querySelector("input[name='updatedImg']").value,
    price: document.querySelector("input[name='updatedPrice']").value,
    quantity: document.querySelector("input[name='updatedQuantity']").value,
  };

  const blogId = document.querySelector("input[name='blogId']").value;

  // MAKE A REQUEST
  const resp = await fetch(`${location.origin}/product/${blogId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(update),
  });

  const data = await resp.json();

  if (resp.status !== 200) {
    alert(data.message);
  } else {
    location.reload();
  }
}
