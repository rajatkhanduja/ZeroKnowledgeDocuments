Zero Knowledge Documents
========================

What does it do?
---------------

Once linked with user's Dropbox account, this application allows the user to read and write AES encrypted text files to `Dropbox/Apps/ZeroKnowledgeDocuments` folder. As the encryption is key is not stored anywhere, the cloud service (in this case, Dropbox) has *zero knowledge* about the user's content.


Why is it required?
-------------------

Many a times, we wish to store personal/private content on the cloud but are troubled by the fact that the content is stored in plaintext (or encrypted using a common key by the service provider). Moreover, we also don't require these files to be unencrypted while on the desktop (as is the case with SpiderOak). This calls for a solution that provides the user with tools to encrypt the content of the file on his/her own desktop without sending out the key to anyone and ever sending out the content in plaintext over the network. 


Example use case(s)
----------------

* Storing a set of personal documents online.
* Storing a file containing passwords on the cloud.
* Storing a file containing bank details on the cloud.

Demo
----

The [demo](https://rajatkhanduja.github.io/ZeroKnowledgeDocuments/) first requires the user to connect to Dropbox and provide the necessary permissions, after which, the user can do the following in `Dropbox/Apps/ZeroKnowledgeDocuments/` folder :-

 
* Create and browse directories
* Create an encrypted text file using the editor in the demo
* Read the encrypted text files in plain text after entering the corresponding password for the file. 

Known Issue(s)
------------
* The password and text can be picked up by extensions/addons installed in the browser. It is suggested that the user take care of the extensions/addons while installing and/or use Incognito mode in Google Chrome (or its equivalent in other browsers) for reading and writing files using this app.

Future plans
------------
* Provide support for other cloud services such as :-
  * Evernote
  * Copy
  * Box
* Provide options to upload images and other file formats.

Thanks to
---------

This project makes use of the code/library provided by the following :-

* [Bootstrap](http://getbootstrap.com/2.3.2/) and [Glyphicons](http://glyphicons.com/)
* [jQuery](http://jquery.com/)
* [Stanford Javascript Crypto Library (SJCL)](crypto.stanford.edu/sjcl/)
* [Zenpen](https://github.com/tholman/zenpen)
* [Underscore.js](http://underscorejs.org/)
* [Dropbox-js](https://github.com/dropbox/dropbox-js)
