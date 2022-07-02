$(document).ready(function(){

    var config = {
        apiKey: "AIzaSyANueGIlPh0aSVOS7cKseMKC39xhAsl3JM",
      authDomain: "homepage-c3b5e.firebaseapp.com",
      projectId: "homepage-c3b5e",
      storageBucket: "homepage-c3b5e.appspot.com",
      messagingSenderId: "313476801849",
      appId: "1:313476801849:web:dec2a5f71d273e05d634e8",
      measurementId: "G-B3XMV4KECF"
    };
    firebase.initializeApp(config);

    var current_user = "";

    firebase.auth().onAuthStateChanged(function(user){

        if(user){

            current_user = user.uid;

            $(".user-text").text(user.email);

            $("#logout").click(function(){

                firebase.auth().signOut()
                    .then(function(){
                        window.location.href = "login.html";
                    })
            })


            $(".sendToFireBase").click(function(){

                var description = $("#description").val();

                firebase.database().ref().child("users").child(current_user).child("todos").push(
                    {
                        description : description,
                        completed : false
                    }
                );

                $("#description").val('');

            })

            var todoRef = firebase.database().ref().child("users/" + current_user).child("todos");
            todoRef.on("value", function(snapshot){

                var $parent = $(".todoList").children("tbody");

                $parent.html('');

                snapshot.forEach(function(item){

                    var completed = item.val().completed == true ? "checked" : "";

                    var description_elem = "<td>" + item.val().description + "</td>";
                    var completed_elem = "<td class='text-center'><input data-key='" + item.key + "' type='checkbox' class='switchery-plugin' " + completed + "/></td>";
                    var removeBtn_elem = "<td class='text-center'><button data-key='" + item.key + "' class='btn btn-danger btn-block removeBtn'>Sil</button></td>";

                    $parent.append("<tr>" + description_elem + completed_elem + removeBtn_elem + "</tr>");

                })

                $(".switchery-plugin").each(function(){
                    new Switchery(this);
                })
            });


            $("body").on("click", ".removeBtn", function(){

                var $key = $(this).data("key");

                firebase.database().ref("users/" + current_user).child("todos").child($key).remove();

            });


            $("body").on("change", ".switchery-plugin", function(){

                var $completed = $(this).prop("checked");

                var $key = $(this).data("key");

                firebase.database().ref("users/" + current_user).child("todos").child($key).child("completed").set($completed);







            })


        }

    })

})
