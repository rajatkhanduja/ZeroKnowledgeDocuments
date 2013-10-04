var client = new Dropbox.Client({ 'key': '75g7txpckgllo8y'});

client.authDriver(new Dropbox.AuthDriver.Redirect({ 'rememberUser': true }));

if (! client.isAuthenticated()) {
  client.authenticate(function (error, client) {
    if (error) {
      console.log(error);
    }
    console.log(client);
  });
}

listDirInHTML(client, "/");
$('#parentDirectory').hide();


$('#newFile').click(function () {
  resetEditor();
  showEditor();
});

$('#closeButton').click(function(){
  resetEditor();
  hideEditor();
});

$('#newDir').click(function () {
  Modal.prompt({
    title: "Create directory",
    input_type:"text",
    optional: {
      affirmative_label: "Create"
    },
    success: function (value) {
      if (value === null || value === "") {
        displayError("Need a directory name");
      }
      else {
        createDirectory(client, pathString(), value);
      }
    }
  });
});

$('#saveFileButton').click(function () {
  if ($('#key').val() === $('#verify_key').val()){
    createFile(client, pathString(), $('#newFileName').text(), $('#fileContent').html(), $('#key').val());
  }
  else{
    displayError("Passwords don't match");
  }
});

$('#reloadDir').click(function () {
  console.log("Reloading...");
  delete dirResults[pathString()];
  listDirInHTML(client, pathString());
});
