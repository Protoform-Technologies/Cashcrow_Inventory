const handleAddMember = async () => {
  if (!name || !email) {
    alert("Please fill all fields");
    return;
  }

  const response = await fetch("/api/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.error);
  } else {
    alert("Invitation email sent!");
    setName("");
    setEmail("");
  }
};