function getIdOfBlog(blogId) {
  document.getElementById("id").value = blogId;
}

async function DeleteBlog() {
  const blogId = document.getElementById("id").value;

  const resp = await fetch(`${location.origin}/profile/${blogId}`, {
    method: "DELETE",
  });

  const data = await resp.json();

  if (resp.status === 200) {
    location.reload();
  } else {
    alert(data.message);
  }
}

async function getIdToUpdate(blogId) {
  document.getElementById("id").value = blogId;
  // fetch the product information so I can show it in the form for update
  const resp = await fetch(`${location.origin}/profile/${blogId}`);

  const data = await resp.json();

  if (resp.status !== 200) {
    alert(data.message);
  }

  // IF IT GETS HERE THE INFORMATION WAS FOUND
  // SO UPDATE THE BLOG UPDATE FIELDS
  document.querySelector("input[name='updatedTitle']").value = data.blog.title;
  document.querySelector("input[name='updatedImage']").value = data.blog.image;
  document.querySelector("input[name='updatedCategory']").value =
    data.blog.category;
  document.querySelector("input[name='blogId']").value = blogId;
  document.querySelector("textarea[name='updatedContent']").value =
    data.blog.content;
}

async function updateBlog() {
  // RETRIEVE THE UPDATED INFO
  const update = {
    title: document.querySelector("input[name='updatedTitle']").value,
    image: document.querySelector("input[name='updatedImage']").value,
    category: document.querySelector("input[name='updatedCategory']").value,
    content: document.querySelector("textarea[name='updatedContent']").value,
  };

  const blogId = document.querySelector("input[name='blogId']").value;

  // MAKE A REQUEST
  const resp = await fetch(`${location.origin}/profile/${blogId}`, {
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
