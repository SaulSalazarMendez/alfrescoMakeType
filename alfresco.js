    var xmlDoc;
    $(document).ready(()=>
    {
        
        var tpl = _.template($("#template-formulario").html() );
        var tplAspectType = _.template($("#template-aspectos-type").html() );
        var tplAttr = _.template($("#template-attr").html() );
        var tplAspec = _.template($("#template-aspect").html() );
        var tplTypeAlfresco = _.template($("#template-type-alfresco").html() );
        var tplAspectAlfresco = _.template($("#template-aspect-alfresco").html() );
        var tplimport =_.template($("#template-import").html());

        var indice=0;
        var arrayMsj=[
            "Necesitas ayuda.",
            "Si te posisiconas en un elemento y das click en mi te digo que tienes que hacer",
            "Ya bajaste cambios",
            "Hablale a ldSilva para que solucione lo que hiciste.",
            "Si no funciona recarga y espera",
            "Todo tiene solución, menos tus problemas",]
        
        
        var json ={
            prefix: "",
            types: [],
            aspects: []
        };

        $("input#file").on('change',loadfile.bind(this))
        function loadfile(fff){
            var archivo = fff.target.files[0];
            var reader = new FileReader();
            reader.readAsText(archivo);
            reader.onload = function (e) {
                var txt = e.target.result;
                var arrTxt = txt.split('/n');
                var file = new File([txt], archivo.name, {type: archivo.type});
                xmlDoc=$($.parseXML( txt ));  
            };
        }  
 
        var alfrescoModule ={
            init: function(){
                this.loadDom();
                this.binder();
                this.render();
                console.log("Modulo cargado");
            },
            loadDom: function(){
                this.ayuda = false;    
            },
            binder: function(){
                $(document).on("click", ".formulario", this.addFormulario.bind(this));
                $(document).on("click", ".addAspect", this.addAspect.bind(this));
                $(document).on("click", ".eliminar", this.deleteElemnt.bind(this));
                $(document).on("click", ".agregarAtributo", this.agregarAtributo.bind(this));
                $(document).on("click", ".agregarAspecto", this.agregarAspecto.bind(this));
                $(document).on("click", ".createTypes", this.createTypes.bind(this));
                $(document).on("click", ".createAspects", this.createAspects.bind(this));
                $(document).on("click", ".limpiarTodo", this.limpiarTodo.bind(this));
                $(document).on("click", ".activarAyuda", this.activarAyuda.bind(this));
                $(document).on('mouseover','button',this.ayudaMsj.bind(this));
                $(document).on('mouseover','input',this.ayudaMsj.bind(this));
                $("#clipo").on('mouseover',this.showAsistentes.bind(this));
                $("#clipo").on('mouseleave',this.hideAsistentes.bind(this));
                $(".ayudante").on("click", this.changeAyudante.bind(this));
                $(".copiarTexto").on("click",this.copiarTexto.bind(this));
                $(document).on('click','.tituloPanel', this.ocultarMostrarPanel.bind(this));
                $(document).on('keyup','input#name',this.mostrarTituloEnPanel.bind(this));
                
            },
            mostrarTituloEnPanel: function(e){
                x=$(e.target).parent().parent().find('span#titulo').text($(e.target).val());
            }
            ,
            ocultarMostrarPanel: function(e){
                x=$(e.target).parent().parent().parent().find('.panel-body');
                if (x.css('display') === 'none') {
                    x.css('display', 'block');
                } else {
                    x.css('display', 'none');
                }
            }
            ,
            copiarTexto: function(e){
                $("#codigo-alfresco")[0].select();
                console.log("copiar");
                document.execCommand('copy');
            },
            changeAyudante: function(e){
                $("#clipo").removeClass("animate");
                this.tiempoanimacion = 
                    setTimeout(()=>{
                        $("#clipo").attr("src","img/"+$(e.target).parent().attr("data-url"));
                        $("#clipo").addClass("animate");
                        clearTimeout(this.tiempoanimacion);//libero el evento de animacion
                    }, 1100);
                $("#mascotas").hide();
            },
            showAsistentes: function(e){
                $("#mascotas").show();
                this.myVar = setTimeout(()=>{$("#mascotas").hide(); clearTimeout(this.myVar);}, 3000);
            },
            hideAsistentes: function(e){
                
            }
            ,
            ayudaMsj: function(e){
                if (!this.ayuda){
                    return;
                }
                var msj = "";
                if ($(e.target).is('button')){
                    if ($(e.target).hasClass("formulario"))
                        msj = "Da click para agrgear un nuevo tipo de dato.";
                    if ($(e.target).hasClass("addAspect"))
                        msj = "Da click para agrgear un nuevo aspecto.";
                    if ($(e.target).hasClass("createTypes"))
                        msj = "Da click para generarar el codigo de los aspectos que agregaste. Tranquil@ no te espantes se abrirá una modal con el código que ocupas añadir en el archivo del model.xml";
                    if ($(e.target).hasClass("createAspects"))
                        msj = "Da click para generarar el codigo de los tipos que agregaste. Tranquil@ no te espantes se abrirá una modal con el código que ocupas añadir en el archivo del model.xml";
                    if ($(e.target).hasClass("limpiarTodo"))
                        msj = "Da click borrar todos los aspectos y tipos que agregaste, tambien borra el prefix.";
                    if ($(e.target).hasClass("agregarAtributo"))
                        msj = "Da click para agregar una propiedad o atributo a este elemento.";
                    if ($(e.target).hasClass("agregarAspecto"))
                        msj = "Da click para agregar un aspecto al tipo.";
                }
                if ($(e.target).is('input')){
                    if ($(e.target).attr("id")=="name")
                        msj = "Ingresas el nombre del campo, este tiene que estras sin espacios";
                    if ($(e.target).attr("id")=="title")
                        msj = "Ingresas el titulo del campo, puede pones espacios o un pequeño texto descriptivo.";
                    if ($(e.target).attr("id")=="mandatory")
                        msj = "Si lo checas indicas que es obligatorio este atributo.";
                    if ($(e.target).attr("id")=="prefix")
                        msj = "Indicas el prefijo del aspecto, normal mente es el mismo que el prefix de arriba pero hay unos casos en los que es diferente.";
                }
                if (msj!=""){
                    $("#helpText").text(msj);
                    $("#helpClipo").show();
                }
                
            }

            ,
            activarAyuda:function(e){
                this.ayuda=!this.ayuda;
                if (this.ayuda){
                    $("#clipo").addClass("animate");
                    $("#helpText").text(arrayMsj[0]);
                    $("#helpClipo").show();
                }else{
                    //$("#clipo").hide();
                    $("#clipo").removeClass("animate");
                    $("#helpClipo").hide();
                }
                
            },
            limpiarTodo:function(e){
                var div = $("div.newFormulario");
                div.remove();
                var div2 = $("div.newAspect");
                div2.remove();
                $("input#prefijo").val("");
            },
            render: function(){
            },
            addAspect: function(){
                var html = tplAspectType({});
                
                $("div#contenido-aspects").append(html);
            },
            addFormulario: function(){
                var html = tpl({});
                
                $("div#contenido-types").append(html);
            },
            deleteElemnt: function(e){
                var div = $(e.target).parent("a").parent("h3").parent("div").parent("div");
                div.remove();
            },
            agregarAspecto:function(e){
                var div = $(e.target).parent("div").find("div.contenidoAspectos");
                var aspectos = div.find("div.newAspect");
                var html = tplAspec({});
                if (aspectos.length>0)
                    $(html).insertBefore(aspectos[0])
                else
                    div.append(html);
            }
            ,
            agregarAtributo: function(e){
                var div = $(e.target).parent("div").find('div.contenidoAtributos');
                var atributos = div.find("div.atributo");
                console.log(div,atributos);
                var html = tplAttr({});
                if (atributos.length>0)
                    $(html).insertBefore(atributos[0])
                else
                    div.append(html);
            },
            generarJson: function(e){
                json.prefix = $("#prefijo").val();
                json.types=[];
                json.aspects=[];
                $.each($(".newFormulario"), (i,valor)=>{
                    let object={
                        name: $(valor).find("input#name").val(),
                        title: $(valor).find("input#title").val(),
                        atributes: [],
                        aspects: []
                    }
                    $.each($(valor).find(".atributo"), (k,data)=>{
                        object.atributes.push({name: $(data).find("input#name").val(), type:$(data).find("select#tipo").val(), mandatory: $(data).find("input#mandatory").prop('checked')});
                    });
                    $.each($(valor).find(".aspecto"), (k,data)=>{
                        object.aspects.push({name: $(data).find("input#name").val(), prefix:$(data).find("input#prefix").val()});
                    });
                    json.types.push(object);
                });
                $.each($(".newAspect"), (i,valor)=>{
                    let object={
                        name: $(valor).find("input#name").val(),
                        title: $(valor).find("input#title").val(),
                        atributes: []
                    }
                    $.each($(valor).find(".atributo"), (k,data)=>{
                        object.atributes.push({name: $(data).find("input#name").val(), type:$(data).find("select#tipo").val(), mandatory: $(data).find("input#mandatory").prop('checked')});
                    });
                    json.aspects.push(object);
                });
                return json;
            },
            createTypes: function(e){
                this.generarJson();
                let html = tplTypeAlfresco({Object:json})
                console.log(json)
                $("#codigo-alfresco").text(html);
                $("#etiquetas").text("types");
            },
            createAspects: function(e){
                this.generarJson();
                console.log("json",json);
                let html = tplAspectAlfresco({Object:json})
                console.log(json)
                $("#codigo-alfresco").text(html);
                $("#etiquetas").text("aspects");
            }
            
        };

        $(document).on("click", "img#clipo", (e)=>{
            if (indice==6){
                indice=0;
                $("#helpClipo").hide();
            }else{
                $("#helpText").text(arrayMsj[indice%6]);
                $("#helpClipo").show();
                indice = indice+1;
            }
        });


        
        // var myVar = setInterval(myTimer, 10000);

        // function myTimer() {
        //     // $("#helpText").text(arrayMsj[indice%6]);
        //     // $("#helpClipo").show();
        //     // indice = indice+1;
        // }
        
        alfrescoModule.init();
    })