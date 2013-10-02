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
  $('#newFileName').focus();
});

$('#newDir').click(function () {
  Modal.prompt({
    title: "Create directory",
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

$('#createFile').click(function () {
  createFile(client, pathString(), $('#newFileName').val(), $('#fileContent').val(), $('#key').val());
});

$('#reloadDir').click(function () {
  console.log("Reloading...");
  delete dirResults[pathString()];
  listDirInHTML(client, pathString());
});
