// Load the Google Transliterate API
if (document.getElementById('selectLanguage').value !== "en") {
    google.load("elements", "1", {
        packages: "transliteration",
        //$('#selectLanguage>option:eq(1)').attr('selected', true);
    });
}
if (document.getElementById('selectLanguage').value == "en") {
    transliterationControl.disableTransliteration();
} else {

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
        var ids = ["transl1", "userUtterance"];
        transliterationControl.makeTransliteratable(ids);

        // Add the STATE_CHANGED event handler to correcly maintain the state
        // of the checkbox.
        transliterationControl.addEventListener(
            google.elements.transliteration.TransliterationControl.EventType.STATE_CHANGED,
            transliterateStateChangeHandler);

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

        // Set the checkbox to the correct state.
        document.getElementById('checkboxId').checked =
            transliterationControl.isTransliterationEnabled();

        // Populate the language dropdown
        var destinationLanguage =
            transliterationControl.getLanguagePair().destinationLanguage;
        var languageSelect = document.getElementById('selectLanguage');
        var supportedDestinationLanguages =
            google.elements.transliteration.getDestinationLanguages(
                google.elements.transliteration.LanguageCode.ENGLISH);
        for (var lang in supportedDestinationLanguages) {
            var opt = document.createElement('option');
            opt.text = lang;
            //if(lang !== "ENGLISH"){
            //if (lang == "ENGLISH" || lang == "MARATHI" || lang == "HINDI" || lang == "TAMIL" || lang == "TELUGU" || lang == "ARABIC" || lang == "PERSIAN" || lang == "RUSSIAN" || lang == "GUJARATI") {
            if (lang == "HINDI" ) {
                opt.value = supportedDestinationLanguages[lang];
                if (destinationLanguage == opt.value) {
                    opt.selected = true;
                }
                try {
                    languageSelect.add(opt, null);
                } catch (ex) {
                    languageSelect.add(opt);
                }
                //  }
            } //End of if
        }

        //$('#selectLanguage>option:eq(1)').attr('selected', true);
        $("#selectLanguage").val($("#target option:first").val());
        //$('#selectLanguage').prepend().val('Select Language');
        $("#selectLanguage").prepend("<option value='en' selected='selected'>English</option>");


    }

    // Handler for STATE_CHANGED event which makes sure checkbox status
    // reflects the transliteration enabled or disabled status.
    function transliterateStateChangeHandler(e) {
        document.getElementById('checkboxId').checked = e.transliterationEnabled;
    }

    // Handler for checkbox's click event.  Calls toggleTransliteration to toggle
    // the transliteration state.
    function checkboxClickHandler() {
        if (document.getElementById('selectLanguage').value == "en") {
            transliterationControl.disableTransliteration();
        } else {
            transliterationControl.toggleTransliteration();
        }
    }

    // Handler for dropdown option change event.  Calls setLanguagePair to
    // set the new language.
    function languageChangeHandler() {
        if (document.getElementById('selectLanguage').value == "en") {
            //alert('selected value is english');
            transliterationControl.disableTransliteration();
            //return;
        } else {
            //enableTransliteration()
            var dropdown = document.getElementById('selectLanguage');
            transliterationControl.setLanguagePair(
                google.elements.transliteration.LanguageCode.ENGLISH,
                dropdown.options[dropdown.selectedIndex].value);
            transliterationControl.enableTransliteration();
        }

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

}