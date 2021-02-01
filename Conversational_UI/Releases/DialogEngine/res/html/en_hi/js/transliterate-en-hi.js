// Load the Google Transliterate API
/*if (document.getElementById('selectLanguage').value !== "en") {
    google.load("elements", "1", {
        packages: "transliteration",
        //$('#selectLanguage>option:eq(1)').attr('selected', true);
    });
}
if (document.getElementById('selectLanguage').value == "en") {
    transliterationControl.disableTransliteration();
} else {*/
google.load("elements", "1", {
    packages: "transliteration",
    //$('#selectLanguage>option:eq(1)').attr('selected', true);
});

var transliterationControl;

function onLoad() {
    var options = {
        sourceLanguage: 'en',
        //destinationLanguage: ['ar','hi','kn','ml','ta','te'],
        destinationLanguage: ['hi'],
        transliterationEnabled: false
        //shortcutKey: 'ctrl+g'
    };
    // Create an instance on TransliterationControl with the required
    // options.
    transliterationControl =
        new google.elements.transliteration.TransliterationControl(options);

    // Enable transliteration in the textfields with the given ids.
    /* var ids = ["transl1", "userUtterance"];
     transliterationControl.makeTransliteratable(ids);*/
    $('.hindiFont').each(function () {
        var id = this.id;
        transliterationControl.makeTransliteratable([id]);
        //alert('called on load')
    })

    // Add the SERVER_UNREACHABLE event handler to display an error message
    // if unable to reach the server.
    transliterationControl.addEventListener(
        google.elements.transliteration.TransliterationControl.EventType.SERVER_UNREACHABLE,
        serverUnreachableHandler);

    // Add the SERVER_REACHABLE event handler to remove the error message
    // once the server becomes reachable.
    transliterationControl.addEventListener(
        google.elements.transliteration.TransliterationControl.EventType.SERVER_REACHABLE,
        serverReachableHandler);

    languageChangeHandler();
}


function languageChangeHandler() {
    if (document.getElementById('selectLanguage_new').value == "en") {
        transliterationControl.disableTransliteration();
    } else {
        var dropdown = document.getElementById('selectLanguage_new');
        transliterationControl.setLanguagePair(
            google.elements.transliteration.LanguageCode.ENGLISH,
            dropdown.options[dropdown.selectedIndex].value);
        transliterationControl.enableTransliteration();
    }
    //alert('called change handler');
}

// SERVER_UNREACHABLE event handler which displays the error message.
function serverUnreachableHandler(e) {
    document.getElementById("errorDiv").innerHTML =
        "Transliteration Server unreachable";
}

// SERVER_UNREACHABLE event handler which clears the error message.
function serverReachableHandler(e) {
    document.getElementById("errorDiv").innerHTML = "";
}
google.setOnLoadCallback(onLoad);

//}