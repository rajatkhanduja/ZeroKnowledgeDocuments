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
  $.msgBox({
    "type": "prompt",
    "title": "Directory name",
    "inputs": [{header:"Name", type:"text"}],
    "buttons": [{value:"OK"}, {value:"Cancel"}],
    "success": function (result, values) {
      if (result === "OK") {
        if (values[0].value === null || values[0].value === "") {
          displayError("Need a directory name");
        }
        else {
          createDirectory(client, pathString(), values[0].value);
        }
      }
    }
  });
});

$('#createFile').click(function () {
  createFile(client, pathString(), $('#newFileName').val(), $('#fileContent').val(), $('#key').val());
});

$('#reloadDir').click(function () {
  console.log("Reloading...");
  dirResults[pathString()] = null;
  listDirInHTML(client, pathString());
});
