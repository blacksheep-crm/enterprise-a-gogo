//Siebel CRM automatic Enterprise deployment
//created for EDUCATIONAL PURPOSES ONLY by Alexander Hansal, blacksheep IT consulting
//uses undocumented SMC REST API (as of May 2020)
//inspired by https://github.com/OracleSiebel/ConfiguringSiebel/tree/master/Containerization/Docker/ol7/manage/scripts/automate-architecture/smc
/*
for(i=should,i=understand,i=read)
 {
    FOR EDUCATIONAL PURPOSES ONLY!!!
    DO NOT USE IN PRODUCTION!!!
 }
 */

//TODO: Export/import profiles as JSON
//TODO: Hire a web designer, please!

//Set passwords
//for testing only, DO NOT STORE PRODUCTION/CRITICAL PASSWORDS HERE!!!

sebl_setpw = function () {
    //DB Table Owner
    sebl_conf.fields.db_tblo_pw.value = "Welcome1";
    //DB User
    sebl_conf.fields.db_user_pw.value = "Welcome1";
    //ANON User
    sebl_conf.fields.ses_anon_user_pw.value = "Welcome1";
    //ZooKeeper Admin
    sebl_conf.fields.zk_user_pw.value = "Welcome1";
    //Primordial/initial SMC User
    sebl_conf.fields.smc_initial_pw.value = "SADMIN";
}

//Main configuration
var sebl_conf = {
    //flow control flags are sequential, i.e. if you set create_ses:false then no ses will be created and ai,mig and optimize won't be executed either
    bootstrap: true,
    create_ent: true,
    create_ses: true,
    create_ai: true,
    create_mig: true,
    optimize: true,
    //deployment control: "none" to create profiles only, "Save" for staging only, "Deploy" for full deployment
    //dependencies are important, e.g. if an enterprise is not deployed, no server can be deployed
    //case sensitive!
    ent_deploy_type: "Deploy",
    ses_deploy_type: "Deploy",
    ai_deploy_type: "Deploy",
    mig_deploy_type: "Deploy",
    //run sebl_checkenv on page load, only set to true if you pre-populated params with valid values in fields section
    auto_check: false,

    //set default values for parameters in the fields section:
    fields: {
        version: {
            value: "20.3", label: "Siebel Version", group: "General", seq: 13,
            tip: "The Siebel CRM Update version that you have installed. Example: 20.5"
        },
        env_type: {
            value: "DR", label: "Siebel Environment Type", group: "General", seq: 14, type: "lov", options: ["DR", "RR"],
            tip: "The Siebel environment type. Valid values are 'DR' (Development/Design Repository) or 'RR' (Test/Prod/Runtime Repository)"
        },
        ai_host: {
            value: "", label: "AI Host Name", group: "General", seq: 1,
            tip: "The fully qualified host name of the Application Interface (AI) tomcat server. Will populate automatically when the Auto-Deploy app is loaded from a valid /siebel/smc location."
        },
        ai_port: {
            value: "", label: "AI tomcat HTTPS Port", group: "General", seq: 2,
            tip: "The https port number of the AI tomcat server. Will populate automatically when the Auto-Deploy app is loaded from a valid /siebel/smc location."
        },
        gw_host: {
            value: "siebel20.company.com", label: "Gateway Host Name", group: "Gateway", seq: 1,
            tip: "The fully qualified host name of the Cloud Gateway (CGW) tomcat server."
        },
        gw_port: {
            value: "9011", label: "Gateway tomcat HTTPS Port", group: "Gateway", seq: 2,
            tip: "The https port number of the Cloud Gateway (CGW) tomcat server."
        },
        ses_host: {
            value: "siebel20.company.com", label: "Siebel Server Host Name", group: "Server", seq: 3,
            tip: "The fully qualified host name of the Siebel Server (SES) tomcat server."
        },
        ses_port: {
            value: "9011", label: "Siebel Server tomcat HTTPS Port", group: "Server", seq: 4,
            tip: "The https port number of the Siebel Server (SES) tomcat server."
        },
        smc_initial_user: {
            value: "SADMIN", label: "AI Primordial User Name", group: "General", seq: 3,
            tip: "The Username provided during AI 17.0 Installation, step 'Application Interface Authentication'.<br><img src='images/smc_initial_user_1.png'>"
        },
        smc_initial_pw: {
            value: "CHANGE_ME", label: "AI Primordial User Password", group: "General", seq: 4, type: "password",
            tip: "The Password provided during AI 17.0 Installation, step 'Application Interface Authentication'.<br><img src='images/smc_initial_user_1.png'>"
        },
        db_type: {
            value: "Oracle", label: "Database Type", group: "Database", seq: 1,
            tip: "The database vendor type. Currently, only 'Oracle' is supported."
        },
        db_host: {
            value: "localhost", label: "Database Host Name", group: "Database", seq: 2,
            tip: "The host name of the database server."
        },
        db_port: {
            value: "1521", label: "Database Port Number", group: "Database", seq: 3,
            tip: "The listener port number of the database service."
        },
        db_sid: {
            value: "orcl", label: "Database TNS Net Service Name", group: "Database", seq: 4,
            tip: "The TNS Net Service Name of the Siebel Database. The 'alias'/'net_service_name' part of an entry in tnsnames.ora."
        },
        sec_sid: {
            value: "orcl", label: "Database Service Name/Identifier", group: "Database", seq: 5,
            tip: "The Database Service Name/Identifier. The 'SERVICE_NAME' part of an entry in tnsnames.ora."
        },
        db_tblspc_idx: {
            value: "SIEBELDB_IDX", label: "Index Tablespace", group: "Database", seq: 6,
            tip: "The name of the index tablespace for the Siebel database."
        },
        db_tblspc_data: {
            value: "SIEBELDB_DATA", label: "Data Tablespace", group: "Database", seq: 7,
            tip: "The name of the data tablespace for the Siebel database."
        },
        db_tblo: {
            value: "SIEBEL", label: "Database Table Owner", group: "General", seq: 5,
            tip: "The table owner user name for the Siebel Database. Typically 'SIEBEL'."
        },
        db_tblo_pw: {
            value: "CHANGE_ME", label: "Database Table Owner Password", group: "General", seq: 6, type: "password",
            tip: "The password of the Siebel Database table owner."
        },
        db_user: {
            value: "SADMIN", label: "Database User Name", group: "General", seq: 7,
            tip: "The Siebel administrative database user name. Typically 'SADMIN'."
        },
        db_user_pw: {
            value: "CHANGE_ME", label: "Database User Password", group: "General", seq: 8, type: "password",
            tip: "The password of the Siebel administrative user."
        },
        zk_port: {
            value: "2330", label: "ZooKeeper Port", group: "Gateway", seq: 3,
            tip: "The ZooKeeper port for client connections. This is NOT the Gateway TLS port. This port will be used to create the ZooKeeper registry in Bootstrap step 3."
        },
        zk_user: {
            value: "SADMIN", label: "ZooKeeper User Name", group: "General", seq: 9,
            tip: "The user name that will be used to connect to Apache ZooKeeper."
        },
        zk_user_pw: {
            value: "CHANGE_ME", label: "ZooKeeper User Password", group: "General", seq: 10, type: "password",
            tip: "The password for the ZooKeeper user."
        },
        ent_fs: {
            value: "\\\\siebel20.company.com\\fs", label: "Enterprise Primary Filesystem", group: "Enterprise", seq: 2,
            tip: "The primary Siebel Enterprise File System path. Must be a valid UNC path. Do not confuse with the FileSystem enterprise parameter."
        },
        ent_name: {
            value: "ENT", label: "Enterprise Name", group: "Enterprise", seq: 1,
            tip: "The name of the Siebel Enterprise."
        },
        ses_anon_user: {
            value: "GUESTCST", label: "Anonymous User Name", group: "General", seq: 11,
            tip: "The user account name for the anonymous user."
        },
        ses_anon_user_pw: {
            value: "CHANGE_ME", label: "Anonymous User Password", group: "General", seq: 12, type: "password",
            tip: "The password for the anonymous user."
        },
        ses_compgrps: {
            value: "callcenter,siebelwebtools,eai", label: "Component Groups", group: "Server", seq: 2, type: "mvg", options: ["callcenter", "siebelwebtools", "eai", "communications"],
            tip: "Comma-separated list of valid standard component group aliases. These groups will be enabled on the Siebel Server at deployment time. The number of groups specified here will influence the server startup time. Choose wisely. You can use Siebel Server Manager later to adjust group assignments."
        },
        //available groups: ["callcenter,siebelwebtools,eai,adm,commmgmt,dataqual,mobilesyncsis,fcstsvc,syncsis,mktgom,rtsremote,creditasgn,search,cra,echannel,edocuments,erm,htim,iss,loyalty,publicsector,rti,ucm,taskui,xmlpreport,workflow,sales,remote,loyaltyengine,lifesciences,sisme,fins,hospitality,econsumer,eautomotive,communications,siebanywhere,saleshiersvc,pimsi,mktgsrv,icomp,sync,dandb,fieldsvc,mobilesync,contctr,asgnmgmt"]
        ses_scb_port: {
            value: "2321", label: "Connection Broker Port", group: "Server", seq: 5,
            tip: "The Siebel Connection Broker port. Default value: 2321."
        },
        ses_syncmgr_port: {
            value: "40400", label: "Synchronization Manager Port", group: "Server", seq: 6,
            tip: "The Siebel Synchronization Manager port. Default value: 40400."
        },
        ses_name: {
            value: "server01", label: "Siebel Server Name", group: "Server", seq: 1,
            tip: "The name of the Siebel Server service."
        },
        ses_langs: {
            value: "enu", label: "Siebel Server Deployment Languages", group: "Server", seq: 7, type: "mvg", options: sebl_langs,
            tip: "Comma-separated list of three-letter (lowercase) language codes. Example: 'deu,enu'. This is used for deployment of the Siebel Server. Make sure you have the corresponding language packs installed."
        },
        ses_manual_comps: {
            value: "BusIntBatchMgr,CustomAppObjMgr_enu,SServiceObjMgr_enu,eServiceObjMgr_enu,InfraEAIOutbound,SMQReceiver,MSMQRcvr,MqSeriesSrvRcvr,MqSeriesAMIRcvr,JMSReceiver,EIM,BusIntMgr", label: "Manual Start Components", group: "Server", seq: 8, type: "mvg", options: ['CustomAppObjMgr_enu', 'SServiceObjMgr_enu', 'eServiceObjMgr_enu', 'JMSReceiver', 'InfraEAIOutbound', 'SMQReceiver', 'MSMQRcvr', 'MqSeriesSrvRcvr', 'MqSeriesAMIRcvr', 'EIM', 'BusIntMgr', 'BusIntBatchMgr'],
            tip: "Comma-separated list of valid standard component aliases. These components will be set to manual start."
        },
        ai_name: {
            value: "AI", label: "AI Name", group: "Application Interface", seq: 1,
            tip: "The name of the Application Interface node."
        },
        ai_app_1: {
            value: "callcenter,enu,sccobjmgr_enu", label: "Application 1", group: "Application Interface", seq: 2,
            tip: "Comma-separated list of application_name,language,object_manager_alias. An application item in the AI profile will be created with these parameters. If left empty, no application will be created."
        },
        ai_app_2: {
            value: "webtools,enu,swtoolsobjmgr_enu", label: "Application 2", group: "Application Interface", seq: 3,
            tip: "Comma-separated list of application_name,language,object_manager_alias. An application item in the AI profile will be created with these parameters. If left empty, no application will be created."
        },
        ai_app_3: {
            value: "eai,enu,eaiobjmgr_enu", label: "Application 3", group: "Application Interface", seq: 4,
            tip: "Comma-separated list of application_name,language,object_manager_alias. An application item in the AI profile will be created with these parameters. If left empty, no application will be created."
        },
        ai_app_4: {
            value: "dav,enu,eaiobjmgr_enu", label: "Application 4", group: "Application Interface", seq: 5,
            tip: "Comma-separated list of application_name,language,object_manager_alias. An application item in the AI profile will be created with these parameters. If left empty, no application will be created."
        },
        ai_app_5: {
            value: "", label: "Application 5", group: "Application Interface", seq: 6,
            tip: "Comma-separated list of application_name,language,object_manager_alias. An application item in the AI profile will be created with these parameters. If left empty, no application will be created."
        },
        ai_app_6: {
            value: "", label: "Application 6", group: "Application Interface", seq: 7,
            tip: "Comma-separated list of application_name,language,object_manager_alias. An application item in the AI profile will be created with these parameters. If left empty, no application will be created."
        },
        ai_app_7: {
            value: "", label: "Application 7", group: "Application Interface", seq: 8,
            tip: "Comma-separated list of application_name,language,object_manager_alias. An application item in the AI profile will be created with these parameters. If left empty, no application will be created."
        },
        ai_app_8: {
            value: "", label: "Application 8", group: "Application Interface", seq: 9,
            tip: "Comma-separated list of application_name,language,object_manager_alias. An application item in the AI profile will be created with these parameters. If left empty, no application will be created."
        },
        mig_name: {
            value: "MIG", label: "Migration App Name", group: "Migration Application", seq: 1,
            tip: "The name of the Migration Application node."
        },
        mig_sid: {
            value: "orcl.company.com", label: "Migration App Database Service Identifier", group: "Migration Application", seq: 2,
            tip: "The fully qualified Database Service Name/Identifier. The 'SERVICE_NAME' part of an entry in tnsnames.ora."
        },
        mig_app: {
            value: "callcenter", label: "Migration App Link Application", group: "Migration Application", seq: 3,
            tip: "The application name (AI profile) to use for links in the Migration Application."
        },
        mig_lang: {
            value: "enu", label: "Migration App Link Application Language", group: "Migration Application", type: "lov", seq: 4, options: sebl_langs,
            tip: "The language/variant name (AI profile) to use for links in the Migration Application."
        },
        mig_loc: {
            value: "", label: "Migration Package Location", group: "Migration Application", seq: 5,
            tip: "Valid UNC path to a shared folder to store Migration Application packages. Leave empty to use the file system 'migration' folder."
        },
        mig_conn_name: {
            value: "DEV", label: "Migration Connection Name", group: "Migration Application", seq: 6,
            tip: "The name for the Connection in the Migration Application to point to the new Enterprise."
        }
    }
};

//some globals
var sebl_currmsg = "";
var sebl_err_flg = false;
var sebl_it = 0; //for intervals
var wait = 5000;
var extended_wait = 20000;
var sebl_getgw_retry = 0;
var sebl_langs = ["deu", "enu"];
var sebl_eai_runstate = "";
var sebl_eai_retry = 0;
var sebl_eai_max_retry = 20;
var sebl_eai_restart = false;
var sebl_discovery_mode = false;

sebl_validate = function () {
    sebl_addmessage("Validating Parameters...");
    //check placeholders
    var placeholders = false;
    var retval = true;
    if (JSON.stringify(sebl_conf).indexOf("CHANGE_ME") > 0) {
        retval = false;
        placeholders = true;
        sebl_addmessage("Please check parameters. Placeholder values were found.", "error");
        alert("Please check parameters. Placeholder values were found.");
        if ($("#parameters").length == 0) {
            sebl_params_gui();
            $("#parameters").find(":input").each(function (x) {
                if ($(this).val() == "CHANGE_ME") {
                    $(this).addClass("sebl-change-me");
                }
            });
        }
    }
    //check compgrps*langs
    var groupcount = sebl_conf.fields.ses_compgrps.value.split(",").length;
    var langcount = sebl_conf.fields.ses_langs.value.split(",").length;
    var m = groupcount * langcount;
    if (m > 6) {
        retval = false;
        sebl_addmessage("Large number of component groups and/or languages specified.", "error");
        retval = confirm("Large number of component groups and/or languages specified.\nThis will slow down server deployment and could cause issues.\nDo you want to continue?");
        retval = !placeholders;
    }
    $("#launch_btn").removeClass("inactive");
    return retval;
}
var sebl_discovery = {
    cghosturi: "",
    status: -1
}
var sebl_proc = {
    current_step: -1,
    steps: [
        { label: "Set CGW Host URI", phase: "Bootstrap", status: 0 },
        { label: "Create SMC Security Profile", phase: "Bootstrap", status: 0 },
        { label: "Create Gateway Registry", phase: "Bootstrap", status: 0 },
        { label: "Create Enterprise Profile " + sebl_conf.fields.ent_name.value + "_profile", phase: "Enterprise", status: 0 },
        { label: "Deploy Enterprise " + sebl_conf.fields.ent_name.value, phase: "Enterprise", status: 0 },
        { label: "Create Siebel Server Profile " + sebl_conf.fields.ses_name.value + "_profile", phase: "Server", status: 0 },
        { label: "Deploy Siebel Server " + sebl_conf.fields.ses_name.value, phase: "Server", status: 0 },
        { label: "Create AI Profile " + sebl_conf.fields.ai_name.value + "_profile", phase: "AI", status: 0 },
        { label: "Deploy AI " + sebl_conf.fields.ai_name.value, phase: "AI", status: 0 },
        { label: "Create Migration Profile " + sebl_conf.fields.mig_name.value + "_profile", phase: "Migration", status: 0 },
        { label: "Deploy Migration App " + sebl_conf.fields.mig_name.value, phase: "Migration", status: 0 },
        { label: "Create Migration Connection " + sebl_conf.fields.mig_conn_name.value, phase: "Migration", status: 0 },
        { label: "Set Components to Manual Start", phase: "Optimize", status: 0 },
        { label: "Set Safe Mode Credentials", phase: "Optimize", status: 0 }
    ]
};

sebl_set_proc_steps = function () {
    sebl_proc.steps[3].label = "Create Enterprise Profile " + sebl_conf.fields.ent_name.value + "_profile";
    sebl_proc.steps[4].label = "Deploy Enterprise " + sebl_conf.fields.ent_name.value;
    sebl_proc.steps[5].label = "Create Siebel Server Profile " + sebl_conf.fields.ses_name.value + "_profile";
    sebl_proc.steps[6].label = "Deploy Siebel Server " + sebl_conf.fields.ses_name.value;
    sebl_proc.steps[7].label = "Create AI Profile " + sebl_conf.fields.ai_name.value + "_profile";
    sebl_proc.steps[8].label = "Deploy AI " + sebl_conf.fields.ai_name.value;
    sebl_proc.steps[9].label = "Create Migration Profile " + sebl_conf.fields.mig_name.value + "_profile";
    sebl_proc.steps[10].label = "Deploy Migration App " + sebl_conf.fields.mig_name.value;
    sebl_proc.steps[11].label = "Create Migration Connection " + sebl_conf.fields.mig_conn_name.value;
}

sebl_diagram = function () {
    $("#diagram_container").remove();
    sebl_set_proc_steps();
    var steps = sebl_proc.steps;
    var dc = $("<div id='diagram_container'>");
    var pc, sc, stc;
    var phase = "";
    var currphase = "start";
    var status;
    var is_current;
    var stepcount = 0;
    var total = 0;
    $("#controls").after(dc);
    for (var i = 0; i < steps.length; i++) {
        if (i == sebl_proc.current_step) {
            is_current = true;
        }
        else {
            is_current = false;
        }
        status = steps[i].status;
        phase = steps[i].phase;
        if (currphase != phase) {
            stepcount = 1;
            total = 0;
            currphase = phase;
            pc = $("<div id='phase_container_" + phase + "' class='sebl-phase'>");
            pc.append("<div class='sebl-phase-title'>" + phase + "</div>");
            dc.append(pc);
        }
        sc = $("<div id='step_container_" + i + "' class='sebl-step'>");
        sc.text(steps[i].label);
        stc = $("<div id='status_container_" + i + "' class='sebl-status'>");
        if (status == 0) {
            if (is_current) {
                stc.addClass("sebl-running");
                sc.addClass("sebl-running");
            }
            else {
                stc.addClass("sebl-not-started");
                sc.addClass("sebl-not-started");
            }
        }
        if (status == 1) {
            stc.addClass("sebl-completed");
            sc.addClass("sebl-completed");
        }
        if (status == 2) {
            stc.addClass("sebl-staged");
            sc.addClass("sebl-staged");
        }
        if (status == -1) {
            stc.addClass("sebl-failed");
            sc.addClass("sebl-failed");
            $("#phase_container_" + phase).addClass("sebl-failed");
        }
        total += status;
        sc.append(stc);
        stepcount++;
        $("#phase_container_" + phase).append(sc);
        if (total == 0) {
            $("#phase_container_" + phase).addClass("sebl-phase-not-started");
        }
        if (total >= stepcount) {
            $("#phase_container_" + phase).removeClass("sebl-phase-not-started");
            $("#phase_container_" + phase).addClass("sebl-phase-completed");
        }
    }

}

sebl_params_gui = function () {
    var pc = $("<div id='parameters'></div>");
    var fa = [];
    var fas = [];
    var seq = 1;
    var j = 0;
    var fs = sebl_conf.fields;
    $("#diagram_container").after(pc);

    //General
    var general = $("<h3>General Parameters / Credentials</h3>");
    pc.append(general);
    var gcontent = $("<div></div>");
    gcontent.append("<div class='sebl-label'>Show Passwords:</div><div class='sebl-param'><input type='checkbox' class='sebl-checkbox'></div>");
    for (f in fs) {
        if (fs[f].group == "General") {
            fs[f].fieldname = f;
            fa.push(fs[f]);
        }
    }
    for (seq = 1; seq <= fa.length; seq++) {
        for (j = 0; j < fa.length; j++) {
            if (fa[j].seq == seq) {
                gcontent.append("<div id='general_lbl_" + seq + "' class='sebl-label' sebl-field='" + fa[j].fieldname + "'>" + fa[j].label + ":</div>");
                gcontent.append("<div id='general_inp_" + seq + "' class='sebl-param'><input type='text' value='" + fa[j].value + "' sebl-field='" + fa[j].fieldname + "'></div>");
                if (fa[j].type == "password") {
                    gcontent.find("#general_inp_" + seq).find("input").attr("type", "password");
                }
            }
        }
    }
    general.after(gcontent);
    seq = 1;
    fa = [];
    fas = [];

    //Database
    var db = $("<h3>Database</h3>");
    gcontent.after(db);
    var dcontent = $("<div></div>");

    for (f in fs) {
        if (fs[f].group == "Database") {
            fs[f].fieldname = f;
            fa.push(fs[f]);
        }
    }
    for (seq = 1; seq <= fa.length; seq++) {
        for (j = 0; j < fa.length; j++) {
            if (fa[j].seq == seq) {
                dcontent.append("<div id='db_lbl_" + seq + "' class='sebl-label' sebl-field='" + fa[j].fieldname + "'>" + fa[j].label + ":</div>");
                dcontent.append("<div id='db_inp_" + seq + "' class='sebl-param'><input type='text' value='" + fa[j].value + "' sebl-field='" + fa[j].fieldname + "'></div>");
            }
        }
    }
    db.after(dcontent);
    seq = 1;
    fa = [];
    fas = [];

    //Gateway
    var gw = $("<h3>Gateway</h3>");
    dcontent.after(gw);
    var gcontent = $("<div></div>");

    for (f in fs) {
        if (fs[f].group == "Gateway") {
            fs[f].fieldname = f;
            fa.push(fs[f]);
        }
    }
    for (seq = 1; seq <= fa.length; seq++) {
        for (j = 0; j < fa.length; j++) {
            if (fa[j].seq == seq) {
                gcontent.append("<div id='gw_lbl_" + seq + "' class='sebl-label' sebl-field='" + fa[j].fieldname + "'>" + fa[j].label + ":</div>");
                gcontent.append("<div id='gw_inp_" + seq + "' class='sebl-param'><input type='text' value='" + fa[j].value + "' sebl-field='" + fa[j].fieldname + "'></div>");
            }
        }
    }
    gw.after(gcontent);
    seq = 1;
    fa = [];
    fas = [];


    //Enterprise
    var ent = $("<h3>Enterprise</h3>");
    gcontent.after(ent);
    var econtent = $("<div></div>");

    for (f in fs) {
        if (fs[f].group == "Enterprise") {
            fs[f].fieldname = f;
            fa.push(fs[f]);
        }
    }
    for (seq = 1; seq <= fa.length; seq++) {
        for (j = 0; j < fa.length; j++) {
            if (fa[j].seq == seq) {
                econtent.append("<div id='ent_lbl_" + seq + "' class='sebl-label' sebl-field='" + fa[j].fieldname + "'>" + fa[j].label + ":</div>");
                econtent.append("<div id='ent_inp_" + seq + "' class='sebl-param'><input type='text' value='" + fa[j].value + "' sebl-field='" + fa[j].fieldname + "'></div>");
            }
        }
    }
    ent.after(econtent);
    seq = 1;
    fa = [];
    fas = [];

    //Server
    var sv = $("<h3>Siebel Server</h3>");
    econtent.after(sv);
    var scontent = $("<div></div>");

    for (f in fs) {
        if (fs[f].group == "Server") {
            fs[f].fieldname = f;
            fa.push(fs[f]);
        }
    }
    for (seq = 1; seq <= fa.length; seq++) {
        for (j = 0; j < fa.length; j++) {
            if (fa[j].seq == seq) {
                scontent.append("<div id='sv_lbl_" + seq + "' class='sebl-label' sebl-field='" + fa[j].fieldname + "'>" + fa[j].label + ":</div>");
                scontent.append("<div id='sv_inp_" + seq + "' class='sebl-param'><input type='text' value='" + fa[j].value + "' sebl-field='" + fa[j].fieldname + "'></div>");
            }
        }
    }
    sv.after(scontent);
    seq = 1;
    fa = [];
    fas = [];


    //AI
    var ai = $("<h3>Application Interface</h3>");
    scontent.after(ai);
    var acontent = $("<div></div>");

    for (f in fs) {
        if (fs[f].group == "Application Interface") {
            fs[f].fieldname = f;
            fa.push(fs[f]);
        }
    }
    for (seq = 1; seq <= fa.length; seq++) {
        for (j = 0; j < fa.length; j++) {
            if (fa[j].seq == seq) {
                acontent.append("<div id='ai_lbl_" + seq + "' class='sebl-label' sebl-field='" + fa[j].fieldname + "'>" + fa[j].label + ":</div>");
                acontent.append("<div id='ai_inp_" + seq + "' class='sebl-param'><input type='text' value='" + fa[j].value + "' sebl-field='" + fa[j].fieldname + "'></div>");
            }
        }
    }
    ai.after(acontent);
    seq = 1;
    fa = [];
    fas = [];


    //Migration
    var mig = $("<h3>Migration Application</h3>");
    acontent.after(mig);
    var mcontent = $("<div></div>");

    for (f in fs) {
        if (fs[f].group == "Migration Application") {
            fs[f].fieldname = f;
            fa.push(fs[f]);
        }
    }
    for (seq = 1; seq <= fa.length; seq++) {
        for (j = 0; j < fa.length; j++) {
            if (fa[j].seq == seq) {
                mcontent.append("<div id='mig_lbl_" + seq + "' class='sebl-label' sebl-field='" + fa[j].fieldname + "'>" + fa[j].label + ":</div>");
                mcontent.append("<div id='mig_inp_" + seq + "' class='sebl-param'><input type='text' value='" + fa[j].value + "' sebl-field='" + fa[j].fieldname + "'></div>");
            }
        }
    }
    mig.after(mcontent);
    seq = 1;
    fa = [];
    fas = [];


    pc.accordion();
    pc[0].scrollIntoViewIfNeeded();

    //update conf on field change
    pc.find(":input").on("change", function (e) {
        if ($(this).attr("sebl-field")) {
            $(this).addClass("changed");
            var field = $(this).attr("sebl-field");
            var value = $(this).val();
            sebl_conf.fields[field].value = value;
            sebl_diagram();
        }
        if ($(this).attr("type") == "checkbox") {
            if (this.checked) {
                pc.find(":input[type='password']").attr("show-pw", "true");
                pc.find(":input[type='password']").attr("type", "text")
            }
            else {
                pc.find(":input[show-pw='true']").attr("type", "password");
            }
        }
    });
    pc.find(":input").on("mouseover", function (e) {
        if ($(this).attr("sebl-field")) {
            var field = $(this).attr("sebl-field");
            var tip = sebl_conf.fields[field].tip;
            var td = $("<div id='tip_" + field + "' class='sebl-tip'>");
            td.html(tip);
            $(this).after(td);
        }
    });
    pc.find(":input").on("mouseout", function (e) {
        if ($(this).attr("sebl-field")) {
            var field = $(this).attr("sebl-field");
            var td = $("#tip_" + field);
            td.remove();
        }
    });
}
sebl_load = function () {
    sebl_addmessage("Loading...");
    sebl_checkloc();
    sebl_bindevents();
    sebl_diagram();
}
sebl_bindevents = function () {
    $("#launch_btn").on("click", function (e) {
        $(this).addClass("inactive");
        sebl_run();
    });
    $("#params_btn").on("click", function (e) {
        if ($("#parameters").length == 0) {
            sebl_params_gui();
        }
        else {
            $("#parameters").remove();
        }
    });
    $("#smc_btn").on("click", function (e) {
        window.open("https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + "/siebel/smc", "_blank");
    });
    $("#verify_btn").on("click", function (e) {
        sebl_checkenv();
    });
    $("#save_btn").on("click", function (e) {
        sebl_saveparams();
    });
    $("#import_btn").on("click", function (e) {
        sebl_importparams();
    });
}
sebl_saveparams = function () {
    var fields = sebl_conf.fields;
    var out = {};
    for (f in fields) {
        out[f] = fields[f].value;
    }

    var dlg = $("<div><textarea id='save_params'></textarea></div>");
    dlg.find("#save_params").val(JSON.stringify(out));
    dlg.dialog({
        title: "Parameters saved to clipboard",
        buttons: [
            {
                text: "Close",
                click: function(e){
                    $(this).dialog("destroy");
                }
            }
        ]
    });
    $("#save_params")[0].select();
    document.execCommand("copy");
}
sebl_importparams = function () {
    var fields = sebl_conf.fields;
    var inp;

    var dlg = $("<div><textarea id='inp_params'></textarea></div>");
    dlg.dialog({
        title: "Import Parameters in JSON Format",
        buttons: [
            {
                text: "Import",
                click: function(e){
                    try{
                        inp = JSON.parse($("#inp_params").val());
                    }
                    catch(e){
                        alert(e.toString());
                    }
                    //console.log(inp);
                    $("#parameters").remove();
                    for (f in fields){
                        fields[f].value = inp[f];
                    }
                    sebl_params_gui();
                    $(this).dialog("destroy");
                }
            }
        ]
    });
}
sebl_addmessage = function (m, c) {
    var md = $("<div class='sebl-msg'>");
    var start;
    var now;
    var elapsed;
    var le;
    md.attr("ts", Date.now().toString());
    if (typeof (c) !== "undefined") {
        if (c == "error") {
            sebl_err_flg = true;
        }
    }
    if (m == sebl_currmsg) {
        le = $("#messages").find(":last-child");
        now = Date.now();
        start = Number(le.attr("ts"));
        elapsed = Math.round((now - start) / 1000);
        le.html(m + " (" + elapsed.toString() + " seconds elapsed)");
        if (typeof (c) !== "undefined") {
            le.addClass(c);
        }
        le[0].scrollIntoViewIfNeeded();
    }
    else {
        if (typeof (c) !== "undefined") {
            md.addClass(c);
        }
        md.html(m);
        $("#messages").append(md);
        md[0].scrollIntoViewIfNeeded();
    }
    sebl_currmsg = m;

    console.log(m);
}
sebl_bounce = function () {
    //POST https://siebel20.company.com:4430/siebel/v1.0/cloudgateway/enterprises/ENT/servers/server01
    //{"Action":"Shutdown"}
    //wait
    //{"Action":"Startup"}
}
sebl_setmigconn = function () {
    sebl_setprocstep(11);
    var v = sebl_conf.fields.version.value;
    var y = parseInt(v.split(".")[0]);
    var m = parseInt(v.split(".")[1]);
    var is203 = false;
    if (y >= 20 && m >= 3) {
        is203 = true;
    }
    sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Connection " + sebl_conf.fields.mig_conn_name.value + " Creation");
    var data = {
        "name": sebl_conf.fields.mig_conn_name.value,
        "restEndpoint": "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + "/siebel/v1.0",
        "isFavourite": "false",
    }
    if (is203 && sebl_conf.fields.version.value == "DR") {
        data.schemaUser = "";
        data.tableSpaceData = "";
        data.tableSpaceIndex = "";
        data.tableSpacePage16K = "";
        data.tableSpacePage32K = "";
        data.isUnicodeDatabase = true;
    }
    if (is203 && sebl_conf.fields.version.value == "RR") {
        data.schemaUser = sebl_conf.fields.db_tblo.value;
        data.tableSpaceData = sebl_conf.fields.db_tblspc_data.value;
        data.tableSpaceIndex = sebl_conf.fields.db_tblspc_idx.value;
        data.tableSpacePage16K = "";
        data.tableSpacePage32K = "";
        data.isUnicodeDatabase = true;
    }
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/migration/connection";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Connection " + sebl_conf.fields.mig_conn_name.value + " created successfully");
            sebl_setprocstate(1);
            if (sebl_conf.optimize) {
                setTimeout(sebl_optimize, wait);
            }
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Connection " + sebl_conf.fields.mig_conn_name.value + " creation failed. Please create manually.", "error");
            if (sebl_conf.optimize) {
                setTimeout(sebl_optimize, wait);
            }
        }
    });

    xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}
sebl_run = function () {
    //sebl_checkenv();
    if (sebl_validate()) {
        sebl_addmessage("Starting deployment...");
        var started = false;
        //order of execution
        //Bootstrap
        if (sebl_discovery.status < 3) {
            sebl_getgw();
            started = true;
        }
        //sebl_setgw();
        //sebl_setsecprof();
        //sebl_creategw();

        //Enterprise
        if (sebl_discovery.status == 3) {
            sebl_setentprof();
            started = true;
        }
        if (sebl_discovery.status == 4) {
            sebl_deployent();
            started = true;
        }
        if (sebl_discovery.status == 5 || sebl_proc.steps[5].status == 0) {
            if (!started) {
                sebl_setsesprof();
                started = true;
            }
        }
        if (sebl_discovery.status == 6 || sebl_proc.steps[6].status == 0) {
            if (!started) {
                sebl_deployses();
                started = true;
            }
        }
        if (!started && sebl_discovery.status == 7) {
            sebl_setaiprof();
        }
        if (!started && sebl_discovery.status == 8) {
            sebl_deployai();
        }
        if (!started && sebl_discovery.status == 9) {
            sebl_setmigprof();
        }
        if (!started && sebl_discovery.status == 10) {
            sebl_deploymig();
        }
        if (!started && sebl_discovery.status == 11) {
            sebl_setmigconn();
        }
        if (!started && sebl_discovery.status == 12) {
            sebl_optimize();
        }
        $("#launch_btn").addClass("inactive");
    }
}
sebl_delses = function () {
    //DELETE https://siebel20.company.com:4430/siebel/v1.0/cloudgateway/deployments/servers/server01?forcedelete=true
}

sebl_deploymig = function () {
    var dt = sebl_conf.mig_deploy_type;
    var msg = "Deployment";
    if (dt == "Save") {
        msg = "Staging";
    }
    if (dt == "Deploy" || dt == "Save") {
        sebl_setprocstep(10);
        var stat = sebl_proc.steps[sebl_proc.current_step].status;
        var verb = "POST";
        sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): " + msg + " started");
        var data = JSON.stringify(
            {
                "DeploymentInfo": {
                    "PhysicalHostIP": sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value,
                    "ProfileName": sebl_conf.fields.mig_name.value + "_profile",
                    "Action": dt
                },
                "MigrationDeployParams": {
                    "SiebelMigration": sebl_conf.fields.mig_name.value,
                    "MigrationDesc": sebl_conf.fields.mig_name.value
                }
            }
        );

        var xhr = new XMLHttpRequest();
        var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
        var endpoint = "/siebel/v1.0/cloudgateway/deployments/migrations/";
        if (stat == 2) {
            endpoint += sebl_conf.fields.mig_name.value;
            verb = "PUT";
        }
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                if (dt == "Deploy") {
                    sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): " + msg + " in progress");
                    sebl_setprocstate(0);
                    sebl_it = setInterval(sebl_checkmig, wait);
                }
                if (dt == "Save") {
                    sebl_addmessage("Siebel Migration app (" + sebl_conf.fields.mig_name.value + "): " + msg + " completed successfully");
                    sebl_setprocstate(2);
                    setTimeout(sebl_optimize, wait);
                }
            }
            else if (this.readyState === 4 && this.status !== 200) {
                sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): " + msg + " failed", "error");
                sebl_setprocstate(-1);
            }
        });

        xhr.open(verb, "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
        xhr.setRequestHeader("Authorization", auth);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }
    else {
        sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.ses_name.value + "): " + "Deployment/Staging" + " not executed. Subsequent steps might fail!", "error");
        setTimeout(sebl_optimize, wait);
    }
}
sebl_getlog = function () {
    //GET https://siebel20.company.com:4430/siebel/v1.0/cloudgateway/deployments/logs/migration/MIG
}
sebl_setmigprof = function () {
    sebl_setprocstep(9);
    sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Profile Creation");
    var data = JSON.stringify(
        {
            "MigrationConfigParams": {
                "Hostname": sebl_conf.fields.db_host.value,
                "Portnum": sebl_conf.fields.db_port.value,
                "TableOwner": sebl_conf.fields.db_tblo.value,
                "Username": sebl_conf.fields.db_user.value,
                "Password": sebl_conf.fields.db_user_pw.value,
                "DatabaseType": sebl_conf.fields.db_type.value,
                "ServiceName": sebl_conf.fields.mig_sid.value,
                "AuthenticationType": "Basic",
                "AuthenticationHost": "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value,
                "LogLevel": "Error",
                "Timeout": 3000,
                "SleepTime": 15,
                "SiebelApplicationName": sebl_conf.fields.mig_app.value,
                "Language": sebl_conf.fields.mig_lang.value,
                "PackageLocation": sebl_conf.fields.mig_loc.value
            },
            "Profile": {
                "ProfileName": sebl_conf.fields.mig_name.value + "_profile"
            }
        }
    );

    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/profiles/migrations/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Profile created successfully");
            sebl_setprocstate(1);
            setTimeout(sebl_deploymig, wait);
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Profile creation failed", "error");
            sebl_setprocstate(-1);
        }
    });

    xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}
sebl_checkentdeployed = function () {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/deployments/enterprises/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var status = JSON.parse(this.response).DeploymentInfo.Status;
            var ok = ["Deployed", "DeployInProgress", "Saved"];
            var found = false;
            if (status == "Deployed") {
                found = true;
                sebl_addmessage("Discovery: Enterprise (" + sebl_conf.fields.ent_name.value + "): " + status);
                sebl_setprocstep(3);
                sebl_setprocstate(1);
                sebl_setprocstep(4)
                sebl_setprocstate(1);
                sebl_discovery.status = 5;
                sebl_getserverprofile(sebl_conf.fields.ses_name.value);
            }
            if (status == "Saved") {
                found = true;
                sebl_addmessage("Discovery: Enterprise (" + sebl_conf.fields.ent_name.value + "): Staged");
                sebl_setprocstep(3);
                sebl_setprocstate(1);
                sebl_setprocstep(4)
                sebl_setprocstate(2);
                sebl_discovery.status = 4;
                sebl_getserverprofile(sebl_conf.fields.ses_name.value);
            }
            if (!found) {
                sebl_addmessage("Discovery: Enterprise (" + sebl_conf.fields.ent_name.value + "): Not Deployed");
            }
        }
        if (this.readyState === 4 && this.status === !200) {
            sebl_addmessage("Discovery: Enterprise (" + sebl_conf.fields.ent_name.value + "): Not Found");
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + sebl_conf.fields.ent_name.value);
    xhr.setRequestHeader("Authorization", auth);
    xhr.send(data);
}
sebl_checksesdeployed = function () {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/deployments/servers/";
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var status = JSON.parse(this.response).DeploymentInfo.Status;
            var ok = ["Deployed", "DeployInProgress", "Saved"];
            var found = false;
            if (status == "Deployed") {
                found = true;
                sebl_addmessage("Discovery: Siebel Server (" + sebl_conf.fields.ses_name.value + "): " + status);
                sebl_setprocstep(5);
                sebl_setprocstate(1);
                sebl_setprocstep(6)
                sebl_setprocstate(1);
                sebl_discovery.status = 7;
                sebl_getaiprofile(sebl_conf.fields.ai_name.value);
            }
            if (status == "Saved") {
                found = true;
                sebl_addmessage("Discovery: Siebel Server (" + sebl_conf.fields.ent_name.value + "): Staged");
                sebl_setprocstep(5);
                sebl_setprocstate(1);
                sebl_setprocstep(6)
                sebl_setprocstate(2);
                sebl_discovery.status = 6;
                sebl_getaiprofile(sebl_conf.fields.ai_name.value);
            }
            if (!found) {
                sebl_addmessage("Discovery: Siebel Server (" + sebl_conf.fields.ses_name.value + "): Not Deployed");
                sebl_discovery.status = 7;
                sebl_getaiprofile(sebl_conf.fields.ai_name.value);
            }
        }
        if (this.readyState === 4 && this.status === !200) {
            sebl_addmessage("Discovery: Enterprise (" + sebl_conf.fields.ses_name.value + "): Not Found");
            sebl_discovery.status = 7;
            sebl_getaiprofile(sebl_conf.fields.ai_name.value);
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + sebl_conf.fields.ses_name.value);
    xhr.setRequestHeader("Authorization", auth);
    xhr.send(data);
}
sebl_checkaideployed = function () {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/deployments/swsm/";
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var status = JSON.parse(this.response).DeploymentInfo.Status;
            var ok = ["Deployed", "DeployInProgress", "Saved"];
            var found = false;
            if (status == "Deployed") {
                found = true;
                sebl_addmessage("Discovery: Application Interface (" + sebl_conf.fields.ai_name.value + "): " + status);
                sebl_setprocstep(7);
                sebl_setprocstate(1);
                sebl_setprocstep(8)
                sebl_setprocstate(1);
                sebl_discovery.status = 9;
                sebl_getmigprofile(sebl_conf.fields.mig_name.value);
            }
            if (status == "Saved") {
                found = true;
                sebl_addmessage("Discovery: Siebel Server (" + sebl_conf.fields.ent_name.value + "): Staged");
                sebl_setprocstep(7);
                sebl_setprocstate(1);
                sebl_setprocstep(8)
                sebl_setprocstate(2);
                sebl_discovery.status = 8;
                sebl_getmigprofile(sebl_conf.fields.mig_name.value);
            }
            if (!found) {
                sebl_addmessage("Discovery: Application Interface (" + sebl_conf.fields.ai_name.value + "): Not Deployed");
                sebl_getmigprofile(sebl_conf.fields.mig_name.value);
            }
        }
        if (this.readyState === 4 && this.status === !200) {
            sebl_addmessage("Discovery: Application Interface (" + sebl_conf.fields.ai_name.value + "): Not Found");
            sebl_getmigprofile(sebl_conf.fields.mig_name.value);
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + "/" + sebl_conf.fields.ai_name.value);
    xhr.setRequestHeader("Authorization", auth);
    xhr.send(data);
}
sebl_checkmigdeployed = function () {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/deployments/migrations/";
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var status = JSON.parse(this.response).DeploymentInfo.Status;
            var ok = ["Deployed", "DeployInProgress", "Saved"];
            var found = false;
            if (status == "Deployed") {
                found = true;
                sebl_addmessage("Discovery: Migration Application (" + sebl_conf.fields.mig_name.value + "): " + status);
                sebl_setprocstep(9);
                sebl_setprocstate(1);
                sebl_setprocstep(10)
                sebl_setprocstate(1);
                sebl_discovery.status = 11;
                sebl_getmigconn(sebl_conf.fields.mig_conn_name.value);
            }
            if (status == "Saved") {
                found = true;
                sebl_addmessage("Discovery: Migration Application (" + sebl_conf.fields.mig_name.value + "): Staged");
                sebl_setprocstep(9);
                sebl_setprocstate(1);
                sebl_setprocstep(10)
                sebl_setprocstate(2);
                sebl_discovery.status = 10;
                sebl_getmigconn(sebl_conf.fields.mig_conn_name.value);
            }
            if (!found) {
                sebl_addmessage("Discovery: Application Interface (" + sebl_conf.fields.mig_name.value + "): Not Deployed");
            }
        }
        if (this.readyState === 4 && this.status === !200) {
            sebl_addmessage("Discovery: Application Interface (" + sebl_conf.fields.mig_name.value + "): Not Found");
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + "/" + sebl_conf.fields.mig_name.value);
    xhr.setRequestHeader("Authorization", auth);
    xhr.send(data);
}
sebl_checkent = function () {
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/deployments/enterprises/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var status = JSON.parse(this.response).DeploymentInfo.Status;
            var ok = ["Deployed", "DeployInProgress", "Saved"];
            if (status == "Deployed") {
                sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): Deployment completed successfully");
                clearInterval(sebl_it);
                sebl_setprocstate(1);
                if (sebl_conf.create_ses) {
                    setTimeout(sebl_setsesprof, wait);
                }
            }
            if (status == "DeployInProgress") {
                sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): Deployment in progress");
            }
            if (ok.indexOf(status) == -1) {
                sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): Deployment failed", "error");
                clearInterval(sebl_it);
                sebl_setprocstate(-1);
            }
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + "/" + sebl_conf.fields.ent_name.value);
    xhr.setRequestHeader("Authorization", auth);

    xhr.send();
}

sebl_checkmig = function () {
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/deployments/migrations/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var status = JSON.parse(this.response).DeploymentInfo.Status;
            var ok = ["Deployed", "DeployInProgress", "Saved"];
            if (status == "Deployed") {
                sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Deployment completed successfully");
                clearInterval(sebl_it);
                sebl_setprocstate(1);
                setTimeout(sebl_checkeai, wait);
            }
            if (status == "DeployInProgress") {
                sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Deployment in progress");
            }
            if (ok.indexOf(status) == -1) {
                sebl_addmessage("Siebel Migration App (" + sebl_conf.fields.mig_name.value + "): Deployment failed", "error");
                clearInterval(sebl_it);
                sebl_setprocstate(-1);
            }
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + "/" + sebl_conf.fields.mig_name.value);
    xhr.setRequestHeader("Authorization", auth);

    xhr.send();
}

sebl_checkses = function () {
    var groupcount = sebl_conf.fields.ses_compgrps.value.split(",").length;
    var langcount = sebl_conf.fields.ses_langs.value.split(",").length;
    var standby = extended_wait * groupcount * langcount;
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/deployments/servers/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var status = JSON.parse(this.response).DeploymentInfo.Status;
            var ok = ["Deployed", "DeployInProgress", "Saved"];
            if (status == "Deployed") {
                sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): Deployment completed successfully");
                sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): Please stand by while we wait " + (standby / 1000).toString() + " seconds for the server to cool down");
                clearInterval(sebl_it);
                sebl_setprocstate(1);
                if (sebl_conf.create_ai) {
                    if (sebl_proc.steps[7].status == 0) {
                        setTimeout(sebl_setaiprof, standby);
                    }
                }
            }
            if (status == "DeployInProgress") {
                sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): Deployment in progress");
            }
            if (ok.indexOf(status) == -1) {
                sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): Deployment failed", "error");
                clearInterval(sebl_it);
                sebl_setprocstate(-1);
            }
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + "/" + sebl_conf.fields.ses_name.value);
    xhr.setRequestHeader("Authorization", auth);

    xhr.send();
}

sebl_checkai = function () {
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/deployments/swsm/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var status = JSON.parse(this.response).DeploymentInfo.Status;
            var ok = ["Deployed", "DeployInProgress", "Saved"];
            if (status == "Deployed") {
                sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): Deployment completed successfully");
                clearInterval(sebl_it);
                sebl_setprocstate(1);
                if (sebl_conf.create_mig) {
                    setTimeout(sebl_setmigprof, wait);
                }
            }
            if (status == "DeployInProgress") {
                sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): Deployment in progress");
            }
            if (ok.indexOf(status) == -1) {
                sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): Deployment failed", "error");
                clearInterval(sebl_it);
                sebl_setprocstate(-1);
            }
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + "/" + sebl_conf.fields.ai_name.value);
    xhr.setRequestHeader("Authorization", auth);
    xhr.send();
}

sebl_deployai = function () {
    var dt = sebl_conf.ai_deploy_type;
    var msg = "Deployment";
    if (dt == "Save") {
        msg = "Staging";
    }
    if (dt == "Deploy" || dt == "Save") {
        sebl_setprocstep(8);
        var stat = sebl_proc.steps[sebl_proc.current_step].status;
        var verb = "POST";
        sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): " + msg + " started");
        var data = JSON.stringify(
            {
                "DeploymentInfo": {
                    "PhysicalHostIP": sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value,
                    "ProfileName": sebl_conf.fields.ai_name.value + "_profile",
                    "Action": dt
                },
                "DeploymentParam": {
                    "Node": sebl_conf.fields.ai_name.value,
                    "NodeDesc": sebl_conf.fields.ai_name.value
                }
            }
        );

        var xhr = new XMLHttpRequest();
        var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
        var endpoint = "/siebel/v1.0/cloudgateway/deployments/swsm/";
        if (stat == 2) {
            endpoint += sebl_conf.fields.ai_name.value;
            verb = "PUT";
        }
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                if (dt == "Deploy") {
                    sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): " + msg + " in progress");
                    sebl_setprocstate(0);
                    sebl_it = setInterval(sebl_checkai, wait);
                }
                if (dt == "Save") {
                    sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): " + msg + " completed successfully");
                    sebl_setprocstate(2);
                    setTimeout(sebl_setmigprof, wait);
                }
            }
            else if (this.readyState === 4 && this.status !== 200) {
                sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): " + msg + " failed", "error");
                sebl_setprocstate(-1);
            }
        });

        xhr.open(verb, "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
        xhr.setRequestHeader("Authorization", auth);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }
    else {
        sebl_addmessage("Siebel AI (" + sebl_conf.fields.ses_name.value + "): " + "Deployment/Staging" + " not executed. Subsequent steps might fail!", "error");
        setTimeout(sebl_setmigprof, wait);
    }
}
sebl_setaiprof = function () {
    sebl_setprocstep(7);
    sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): Profile Creation");
    var apps = [];
    var app;
    var fs = sebl_conf.fields;
    for (f in fs) {
        if (f.indexOf("ai_app_") == 0) {
            if (fs[f].value != "") {
                app = {
                    "Name": fs[f].value.split(",")[0],
                    "ObjectManager": fs[f].value.split(",")[2],
                    "Language": fs[f].value.split(",")[1],
                    "StartCommand": "",
                    "EnableExtServiceOnly": false,
                    "AvailableInSiebelMobile": false,
                    "AuthenticationProperties": {
                        "SessionTimeout": 9000,
                        "SessionTimeoutWarning": 60,
                        "GuestSessionTimeout": 300,
                        "SessionTimeoutWLMethod": "HeartBeat",
                        "SessionTimeoutWLCommand": "UpdatePrefMsg",
                        "SessionTokenMaxAge": 2880,
                        "SessionTokenTimeout": 9000,
                        "MaxTabs": 1,
                        "SingleSignOn": false,
                        "AnonUserName": "",
                        "AnonPassword": ""
                    }
                };
                if (app.ObjectManager.indexOf("eaiobjmgr") == 0) {
                    app.EnableExtServiceOnly = true;
                    app.UseAnonPool = false;
                    app.EAISOAPMaxRetry = 0;
                    app.EAISOAPNoSessInPref = false;
                }
                apps.push(app);
            }
        }
    }
    var data = {
        "ConfigParam":
        {
            "defaults":
            {
                "DoCompression": false,
                "EnableFQDN": false,
                "AuthenticationProperties":
                {
                    "SessionTimeout": 9000,
                    "SessionTimeoutWarning": 60,
                    "GuestSessionTimeout": 300,
                    "SessionTimeoutWLMethod": "HeartBeat",
                    "SessionTimeoutWLCommand": "UpdatePrefMsg",
                    "SessionTokenMaxAge": 2880,
                    "SessionTokenTimeout": 9000,
                    "MaxTabs": 1,
                    "SingleSignOn": false,
                    "AnonUserName": sebl_conf.fields.ses_anon_user.value,
                    "AnonPassword": sebl_conf.fields.ses_anon_user_pw.value
                }
            },
            "RESTInBound":
            {
                "RESTAuthenticationProperties":
                {
                    "AnonUserName": sebl_conf.fields.ses_anon_user.value,
                    "AnonPassword": sebl_conf.fields.ses_anon_user_pw.value,
                    "AuthenticationType": "Basic",
                    "SessKeepAlive": 900,
                    "ValidateCertificate": true
                },
                "LogProperties": { "LogLevel": "ERROR" },
                "ObjectManager": "eaiobjmgr_enu",
                "Baseuri": "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + "/siebel/v1.0/",
                "MaxConnections": 20,
                "RESTResourceParamList": []
            },
            "UI": { "LogProperties": { "LogLevel": "ERROR" } },
            "EAI": { "LogProperties": { "LogLevel": "ERROR" } },
            "DAV": { "LogProperties": { "LogLevel": "ERROR" } },
            "RESTOutBound": { "LogProperties": { "LogLevel": "ERROR" } },
            "SOAPOutBound": { "LogProperties": { "LogLevel": "ERROR" } },
            "Applications": [],
            "RESTInBoundResource": [],
            "swe": {
                "Language": "ENU",
                "MaxQueryStringLength": -1,
                "SeedFile": "",
                "SessionMonitor": false,
                "AllowStats": true
            }
        },
        "Profile":
            { "ProfileName": sebl_conf.fields.ai_name.value + "_profile" }
    };
    for (var i = 0; i < apps.length; i++) {
        data.ConfigParam.Applications.push(apps[i]);
    }
    data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/profiles/swsm/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): Profile created successfully");
            sebl_setprocstate(1);
            setTimeout(sebl_deployai, wait);
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Siebel AI (" + sebl_conf.fields.ai_name.value + "): Profile creation failed", "error");
            sebl_setprocstate(-1);
        }
    });

    xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}
sebl_optimize = function () {
    var last_one = false;
    sebl_addmessage("Optimizing Server " + sebl_conf.fields.ses_name.value);
    var man_comps = sebl_conf.fields.ses_manual_comps.value.split(",");
    for (var i = 0; i < man_comps.length; i++) {
        if (i + 1 == man_comps.length) {
            last_one = true;
        }
        sebl_setmanualstart(man_comps[i], last_one);
    }
}

sebl_setmanualstart = function (comp, last_one) {
    sebl_setprocstep(12);
    var lo = last_one;
    var data = JSON.stringify({ "Action": "manual start" });
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/enterprises/" + sebl_conf.fields.ent_name.value + "/servers/" + sebl_conf.fields.ses_name.value + "/components/";
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            sebl_addmessage("Component " + comp + " : Request to set to Manual Start submitted successfully.");
            if (lo) {
                sebl_addmessage("Please verify manual start settings. Requires server re-start.")
                sebl_setprocstate(1);
                setTimeout(sebl_setsafemode, wait);
            }
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Component " + comp + " set to manual start failed", "error");
            sebl_setprocstate(-1);
        }
    });

    xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + comp);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}
sebl_managecomp = function (comp, action) {
    sebl_addmessage(action + " of comp " + comp);
    //Shutdown, Startup, Pause, Resume
    var data = JSON.stringify({ "Action": action });
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/enterprises/" + sebl_conf.fields.ent_name.value + "/servers/" + sebl_conf.fields.ses_name.value + "/components/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.response);

            if (typeof (response["Result"]) !== "undefined") {
                var status = JSON.parse(this.response)["Result"][0].CP_DISP_RUN_STATE;
                if (status != "") {
                    sebl_addmessage("Status of component " + comp + ": " + status);
                    sebl_eai_runstate = status;
                }
            }
            else if (typeof (response["Error"]) !== "undefined") {
                var errmsg = response["Error"].ErrMessage;
                sebl_addmessage(action + " of comp " + comp + " failed.<br>" + errmsg, "error");
            }


        }
        else if (this.readyState === 4 && this.status !== 200) {
            //do nothing
        }
    });

    xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + comp);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}
sebl_deployses = function () {
    var dt = sebl_conf.ses_deploy_type;
    var msg = "Deployment";
    if (dt == "Save") {
        msg = "Staging";
    }
    if (dt == "Deploy" || dt == "Save") {
        sebl_setprocstep(6);
        var stat = sebl_proc.steps[sebl_proc.current_step].status;
        var verb = "POST";
        sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): " + msg + " started");
        var data = JSON.stringify(
            {
                "DeploymentInfo": {
                    "PhysicalHostIP": sebl_conf.fields.ses_host.value + ":" + sebl_conf.fields.ses_port.value,
                    "ProfileName": sebl_conf.fields.ses_name.value + "_profile",
                    "Action": dt
                },
                "ServerDeployParams": {
                    "SiebelServer": sebl_conf.fields.ses_name.value,
                    "SiebelServerDesc": "Server " + sebl_conf.fields.ses_name.value,
                    "DeployedLanguage": sebl_conf.fields.ses_langs.value
                }
            }
        );

        var xhr = new XMLHttpRequest();
        var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
        var endpoint = "/siebel/v1.0/cloudgateway/deployments/servers/";
        if (stat == 2) {
            endpoint += sebl_conf.fields.ses_name.value;
            verb = "PUT";
        }
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                if (dt == "Deploy") {
                    sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): " + msg + " in progress");
                    sebl_setprocstate(0);
                    sebl_it = setInterval(sebl_checkses, wait);
                }
                if (dt == "Save") {
                    sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): " + msg + " completed successfully");
                    sebl_setprocstate(2);
                    setTimeout(sebl_setaiprof, wait);
                }
            }
            else if (this.readyState === 4 && this.status !== 200) {
                sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): " + msg + " failed", "error");
                sebl_setprocstate(-1);
            }
        });

        xhr.open(verb, "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
        xhr.setRequestHeader("Authorization", auth);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }
    else {
        sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): " + "Deployment/Staging" + " not executed. Subsequent steps might fail!", "error");
        setTimeout(sebl_setaiprof, wait);
    }
}
sebl_setsesprof = function () {
    sebl_setprocstep(5);
    sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): Profile creation");
    var data = JSON.stringify(
        {
            "ServerConfigParams": {
                "Username": sebl_conf.fields.db_user.value,
                "Password": sebl_conf.fields.db_user_pw.value,
                "AnonLoginUserName": sebl_conf.fields.ses_anon_user.value,
                "AnonLoginPassword": sebl_conf.fields.ses_anon_user_pw.value,
                "EnableCompGroupsSIA": sebl_conf.fields.ses_compgrps.value,
                "SCBPort": sebl_conf.fields.ses_scb_port.value,
                "LocalSynchMgrPort": sebl_conf.fields.ses_syncmgr_port.value,
                "ModifyServerEncrypt": "false",
                "ModifyServerAuth": "false",
                "ClusteringEnvironmentSetup": "NotClustered",
                "UseOracleConnector": "true"
            },
            "Profile": {
                "ProfileName": sebl_conf.fields.ses_name.value + "_profile"
            }
        }
    );

    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/profiles/servers";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): Profile created successfully");
            sebl_setprocstate(1);
            setTimeout(sebl_deployses, wait);
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Siebel Server (" + sebl_conf.fields.ses_name.value + "): Profile creation failed", "error");
            sebl_setprocstate(-1);
        }
    });

    xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}
sebl_deployent = function () {
    //debugger;
    var dt = sebl_conf.ent_deploy_type;
    var msg = "Deployment";
    if (dt == "Save") {
        msg = "Staging";
    }
    if (dt == "Deploy" || dt == "Save") {
        sebl_setprocstep(4);
        var stat = sebl_proc.steps[sebl_proc.current_step].status;
        var verb = "POST";
        sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): " + msg + " started");
        var data = JSON.stringify(
            {
                "DeploymentInfo": {
                    "ProfileName": sebl_conf.fields.ent_name.value + "_profile",
                    "Action": dt
                },
                "EnterpriseDeployParams": {
                    "SiebelEnterprise": sebl_conf.fields.ent_name.value,
                    "EnterpriseDesc": "Enterprise " + sebl_conf.fields.ent_name.value
                }
            }
        );

        var xhr = new XMLHttpRequest();
        var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
        var endpoint = "/siebel/v1.0/cloudgateway/deployments/enterprises/";
        if (stat == 2) {
            endpoint += sebl_conf.fields.ent_name.value;
            verb = "PUT";
        }
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                if (dt == "Deploy") {
                    sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): " + msg + " in progress");
                    sebl_setprocstate(0);
                    sebl_it = setInterval(sebl_checkent, wait);
                }
                if (dt == "Save") {
                    sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): " + msg + " completed successfully");
                    sebl_setprocstate(2);
                    if (sebl_conf.ses_deploy_type == "Deploy") {
                        sebl_conf.ses_deploy_type = "Save";
                    }
                    setTimeout(sebl_setsesprof, wait);
                }
            }
            else if (this.readyState === 4 && this.status !== 200) {
                sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): " + msg + " failed", "error");
                sebl_setprocstate(-1);
            }
        });

        xhr.open(verb, "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
        xhr.setRequestHeader("Authorization", auth);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }
    else {
        sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): " + "Deployment/Staging" + " not executed. Subsequent steps might fail!", "error");
        sebl_conf.ses_deploy_type = "none";
        setTimeout(sebl_setsesprof, wait);
    }
}

sebl_setentprof = function () {
    sebl_setprocstep(3);
    sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): Profile Creation");
    var data = JSON.stringify({
        "EnterpriseConfigParams": {
            "ServerFileSystem": sebl_conf.fields.ent_fs.value,
            "UserName": sebl_conf.fields.db_user.value,
            "Password": sebl_conf.fields.db_user_pw.value,
            "DatabasePlatform": sebl_conf.fields.db_type.value,
            "DBConnectString": sebl_conf.fields.db_sid.value,
            "DBUsername": sebl_conf.fields.db_user.value,
            "DBUserPasswd": sebl_conf.fields.db_user_pw.value,
            "TableOwner": sebl_conf.fields.db_tblo.value,
            "SecAdptProfileName": "Gateway",
            "PrimaryLanguage": "enu",
            "Encrypt": "SISNAPI"
        },
        "Profile": {
            "ProfileName": sebl_conf.fields.ent_name.value + "_profile"
        }
    }
    );

    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/profiles/enterprises";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): Profile created successfully");
            sebl_setprocstate(1);
            setTimeout(sebl_deployent, wait);
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Enterprise (" + sebl_conf.fields.ent_name.value + "): Profile creation failed", "error");
            sebl_setprocstate(-1);
        }
    });

    xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}
sebl_setprocstate = function (status) {
    sebl_proc.steps[sebl_proc.current_step].status = status;
    if (status == -1) {
        sebl_err_flg = true;
        sebl_summary();
    }
    sebl_diagram();
}
sebl_resetprocstate = function () {
    var steps = sebl_proc.steps;
    for (var i = 0; i < steps.length; i++) {
        steps[i].status = 0;
    }
}
sebl_setprocstep = function (step) {
    sebl_proc.current_step = step;
    sebl_diagram();
}
sebl_checkgw = function () {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/bootstrapCG";
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            sebl_addmessage("Discovery: Gateway Registry found");
            sebl_setprocstep(0);
            sebl_setprocstate(1);
            sebl_setprocstep(1);
            sebl_setprocstate(1);
            sebl_setprocstep(2);
            sebl_setprocstate(1);
            sebl_discovery.status = 3;
            sebl_getentprofile(sebl_conf.fields.ent_name.value);
        }
        if (this.readyState === 4 && this.status !== 200) {
            if (this.status === 401) {
                sebl_addmessage("Discovery: Could not connect to REST API, possibly because of wrong username and/or password", "error");
            }
            else {
                sebl_addmessage("Discovery: Gateway Registry not found (this is fine)");
            }
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}
sebl_creategw = function () {
    if (sebl_discovery.status === 2) {
        sebl_setprocstep(2);
        sebl_addmessage("Bootstrap step 3: Gateway Registry Creation");
        var data = JSON.stringify(
            {
                "registryPort": sebl_conf.fields.zk_port.value,
                "registryUserName": sebl_conf.fields.zk_user.value,
                "registryPassword": sebl_conf.fields.zk_user_pw.value,
                "PrimaryLanguage": "enu"
            }
        );

        var xhr = new XMLHttpRequest();
        var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
        var endpoint = "/siebel/v1.0/cloudgateway/bootstrapCG";
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                //sebl_addmessage(this.responseText);
                //Gateway configuration added
                sebl_addmessage("Bootstrap step 3: Gateway Registry created successfully");
                sebl_discovery.status = 3;
                sebl_setprocstate(1);
                if (sebl_conf.create_ent) {
                    setTimeout(sebl_setentprof, wait);
                }
            }
            else if (this.readyState === 4 && this.status !== 200) {
                sebl_addmessage("Bootstrap step 3: Gateway Registry creation failed", "error");
                sebl_setprocstate(-1);
            }
        });

        xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
        xhr.setRequestHeader("Authorization", auth);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }
    else {
        sebl_addmessage("Bootstrap step 3: Gateway Registry Creation not executed");
        sebl_summary();
    }
}
sebl_summary = function () {
    if (sebl_err_flg) {
        sebl_addmessage("Process completed with errors or warnings. Please check your configuration and environment.");
    }
    else {
        sebl_addmessage("Process completed successfully.");
    }
    sebl_addlinks();
}
sebl_addlinks = function () {
    var url = "";
    if (sebl_conf.fields.ai_port.value == "443") {
        url = "https://" + sebl_conf.fields.ai_host.value + "/siebel/";
    }
    else {
        url = "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + "/siebel/";
    }
    var appurl = url + "app/" + sebl_conf.fields.ai_app_1.value.split(",")[0] + "/" + sebl_conf.fields.ai_app_1.value.split(",")[1];
    var smc = "<a href='" + url + "smc' target='_blank'>SMC: " + url + "smc</a>";
    var mig = "<a href='" + url + "migration' target='_blank'>Migration Application: " + url + "migration</a>";
    var srv = "srvrmgr /g " + sebl_conf.fields.gw_host.value + ":" + sebl_conf.fields.zk_port.value + " /e " + sebl_conf.fields.ent_name.value + " /u " + sebl_conf.fields.db_user.value;
    var app1 = "<a href='" + appurl + "' target='_blank'>Application 1: " + appurl + "</a>";
    sebl_addmessage("<hr>");
    sebl_addmessage("Some links to get you started");
    sebl_addmessage(smc);
    sebl_addmessage(mig);
    sebl_addmessage(app1);
    sebl_addmessage("Server Manager (run from siebsrvr/bin): " + srv);
}
sebl_setsafemode = function () {
    sebl_setprocstep(13);
    var data = JSON.stringify({
        "username": sebl_conf.fields.db_user.value,
        "password": sebl_conf.fields.db_user_pw.value
    });

    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/safemode";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 201) {
            sebl_addmessage("Safe Mode Credentials set");
            sebl_setprocstate(1);
            sebl_summary();
        }
        else if (this.readyState === 4 && this.status !== 201) {
            sebl_addmessage("Safe Mode Credentials setting failed", "error");
            sebl_setprocstate(-1);
        }
    });

    xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}
sebl_delgw = function () {
    var data = "";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            sebl_addmessage(this.responseText);
        }
    });

    xhr.open("DELETE", "https://siebel20.company.com:4430/siebel/v1.0/cginfo");
    xhr.setRequestHeader("Authorization", "Basic U0FETUlOOlNBRE1JTg==");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}
sebl_setgw = function () {
    if (sebl_discovery.status === 0) {
        sebl_setprocstep(0);
        sebl_addmessage("Bootstrap step 1: CGW Host URI");
        var data = JSON.stringify({ "CGHostURI": sebl_conf.fields.gw_host.value + ":" + sebl_conf.fields.gw_port.value });
        var xhr = new XMLHttpRequest();
        var auth = "Basic " + btoa(sebl_conf.fields.smc_initial_user.value + ":" + sebl_conf.fields.smc_initial_pw.value);
        var endpoint = "/siebel/v1.0/cginfo";
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                //sebl_addmessage(this.responseText);
                //{"status":"Gateway host updated"}
                sebl_addmessage("Bootstrap step 1: CGW Host URI updated successfully");
                sebl_discovery.status = 1;
                sebl_setprocstate(1);
                setTimeout(sebl_setsecprof, wait);
            }
            else if (this.readyState === 4 && this.status !== 200) {
                sebl_addmessage("Bootstrap step 1: CGW Host URI update failed", "error");
                sebl_setprocstate(-1);
            }
        });

        xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
        xhr.setRequestHeader("Authorization", auth);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }
    else {
        sebl_addmessage("Bootstrap step 1: CGW Host URI has already been set.");
        sebl_summary();
    }

}
sebl_checkenv = function () {
    if (sebl_validate()) {
        sebl_addmessage("Discovering current environment using parameters...");
        sebl_resetprocstate();
        sebl_discovery_mode = true;
        sebl_checkgw();
        sebl_discovery_mode = false;
    }
}
sebl_getgw = function () {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.smc_initial_user.value + ":" + sebl_conf.fields.smc_initial_pw.value);
    var endpoint = "/siebel/v1.0/cginfo";
    xhr.withCredentials = true;
    xhr.addEventListener("error", function (e) {
        sebl_addmessage("XHR Error : sebl_getgw", "error");
    });
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            //debugger;
            if (this.status === 401 && sebl_getgw_retry === 0) {
                sebl_addmessage("Primordial user login failed (401), trying DB user");
                sebl_getgw_retry++;
                sebl_conf.fields.smc_initial_user.value = sebl_conf.fields.db_user.value;
                sebl_conf.fields.smc_initial_pw.value = sebl_conf.fields.db_user_pw.value;
                setTimeout(sebl_getgw, wait);
            }
            else if (this.status === 401 && sebl_getgw_retry === 1) {
                sebl_addmessage("DB user login failed (401), please check settings", "error");
            }
            if (this.status === 200) {
                //sebl_addmessage(this.responseText);
                //{"CGHostURI":"https:\/\/siebel20.company.com:9011\/siebel\/v1.0\/cloudgateway"}
                var cghosturi = JSON.parse(this.response).CGHostURI;
                //https://siebel20.company.com:9011/siebel/v1.0/cloudgateway
                if (cghosturi != "") {
                    sebl_addmessage("Found CGHostURI: " + cghosturi);
                    sebl_addmessage("CGW Host URI already set, continue with Security Profile");
                    sebl_discovery.cghosturi = cghosturi;
                    sebl_discovery.status = 1;
                    sebl_discovery.gw_host = cghosturi.split("https://")[1].split(":")[0];
                    sebl_discovery.gw_port = cghosturi.split("https://")[1].split(":")[1].split("/")[0];
                    if (sebl_conf.bootstrap && !sebl_discovery_mode) {
                        setTimeout(sebl_setsecprof, wait);
                    }
                    sebl_setprocstep(0);
                    sebl_setprocstate(1);
                }
                else {
                    sebl_addmessage("CGW Host URI not set, bootstrap needed");
                    sebl_discovery.status = 0;
                    if (sebl_conf.bootstrap && !sebl_discovery_mode) {
                        setTimeout(sebl_setgw, wait);
                    }
                }
            }
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

sebl_setsecprof = function () {
    if (sebl_discovery.status === 1) {
        sebl_setprocstep(1);
        sebl_addmessage("Bootstrap step 2: Security Profile");
        var data = JSON.stringify(
            {
                "Profile": {
                    "ProfileName": "secprof"
                },
                "SecurityConfigParams": {
                    "DataSources": [
                        {
                            "Name": "secprof",
                            "Type": "DB",
                            "Host": sebl_conf.fields.db_host.value,
                            "Port": sebl_conf.fields.db_port.value,
                            "SqlStyle": "Oracle",
                            "Endpoint": sebl_conf.fields.sec_sid.value,
                            "TableOwner": sebl_conf.fields.db_tblo.value,
                            "CRC": "",
                            "HashUserPwd": "false"
                        }
                    ],
                    "SecAdptMode": "DB",
                    "SecAdptName": "DBSecAdpt",
                    "DBSecurityAdapterDataSource": "secprof",
                    "DBSecurityAdapterPropagateChange": "false",
                    "NSAdminRole": ["Siebel Administrator"],
                    "TestUserName": sebl_conf.fields.db_user.value,
                    "TestUserPwd": sebl_conf.fields.db_user_pw.value
                }
            }
        );

        var xhr = new XMLHttpRequest();
        var auth = "Basic " + btoa(sebl_conf.fields.smc_initial_user.value + ":" + sebl_conf.fields.smc_initial_pw.value);
        var endpoint = "/siebel/v1.0/cloudgateway/GatewaySecurityProfile";
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                sebl_addmessage("Bootstrap step 2: Security Profile created successfully");
                sebl_discovery.status = 2;
                sebl_setprocstate(1);
                setTimeout(sebl_creategw, wait);
            }
            else if (this.readyState === 4 && this.status !== 200) {
                sebl_addmessage("Bootstrap step 2: Security Profile creation failed", "error");
                sebl_setprocstate(-1);
            }
        });

        xhr.open("POST", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
        xhr.setRequestHeader("Authorization", auth);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }
    else {
        sebl_addmessage("Bootstrap step 2: Security Profile not executed");
    }
}

sebl_checkloc = function () {
    //if (window.location.origin.toLowerCase() === "https://" + sebl_conf.fields.ai_host.value.toLowerCase() + ":" + sebl_conf.fields.ai_port.value) {
    if (window.location.pathname.indexOf("/siebel/smc") == 0) {
        var httpsport = "";
        if (window.location.port == "") {
            httpsport = "443";
        }
        else {
            httpsport = window.location.port;
        }

        sebl_addmessage("Loaded from " + window.location.hostname + ":" + httpsport + ". Go for launch!");
        if (sebl_conf.fields.ai_host.value == "") {
            sebl_conf.fields.ai_host.value = window.location.hostname;
        }
        if (sebl_conf.fields.ai_port.value == "") {
            sebl_conf.fields.ai_port.value = httpsport;
        }
        sebl_discovery.ai_host = window.location.hostname;
        sebl_discovery.ai_port = httpsport;
        $("#smc_btn").show();

        //deactivate setpw if security is of concern, it's just for speeding up testing
        sebl_setpw();
        if (sebl_conf.auto_check) {
            sebl_checkenv();
        }
    }

    else {
        sebl_addmessage("Loaded from wrong location, expecting AI host. Please load from siebel/smc URL.", "error");
        $("#launch_btn").addClass("inactive");
        $("#verify_btn").addClass("inactive");
    }
}

sebl_checkeai = function () {
    sebl_eai_retry = 0;
    sebl_addmessage("EAI Object Manager: Checking status");
    sebl_getcompstatus("eaiobjmgr_enu");
    sebl_it = setInterval(function () {
        sebl_eai_retry++;
        if (!(sebl_eai_runstate == "Online" || sebl_eai_runstate == "Running")) {
            if (sebl_eai_retry < sebl_eai_max_retry) {
                sebl_getcompstatus("eaiobjmgr_enu");
            }
            else {
                clearInterval(sebl_it);
                if (!sebl_eai_restart) {
                    sebl_addmessage("EAI Object Manager: Reached maximum retry count. Trying to re-start.", "error");
                    sebl_eai_restart = true;
                    if (sebl_eai_runstate != "Shutdown") {
                        sebl_managecomp("eaiobjmgr_enu", "Shutdown");
                        setTimeout(function () {
                            sebl_managecomp("eaiobjmgr_enu", "Startup");
                            setTimeout(sebl_checkeai, 20000);
                        }, 60000);
                    }
                    else {
                        sebl_managecomp("eaiobjmgr_enu", "Startup");
                        setTimeout(sebl_checkeai, 20000);
                    }
                }
                else {
                    sebl_addmessage("EAI Object Manager: Reached maximum retry count. Please create Migration Connection manually", "error");
                    setTimeout(sebl_optimize, wait);
                }
            }
        }
        else if (sebl_eai_runstate == "Online" || sebl_eai_runstate == "Running") {
            clearInterval(sebl_it);
            setTimeout(sebl_setmigconn, wait);
        }
    }, wait);
}
sebl_getcompstatus = function (comp) {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/enterprises/" + sebl_conf.fields.ent_name.value + "/servers/" + sebl_conf.fields.ses_name.value + "/components/";
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.response);
            if (typeof (response["Result"]) !== "undefined") {
                var status = JSON.parse(this.response)["Result"][0].CP_RUN_STATE;
                if (status != "") {
                    sebl_addmessage("Status of component " + comp + ": " + status);
                    sebl_eai_runstate = status;
                }
            }
            else if (typeof (response["Error"]) !== "undefined") {
                var errmsg = response["Error"].ErrMessage;
                sebl_addmessage("Get status of comp " + comp + " failed.<br>" + errmsg, "error");
            }

        }
        else if (this.readyState === 4 && this.status !== 200) {
            //do nothing
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint + comp);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

sebl_getentprofile = function (ent) {
    var data = "";

    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/profiles/enterprises/" + ent + "_profile";

    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.response);
            if (typeof (JSON.parse(this.response)["Profile"]) !== "undefined") {
                if (JSON.parse(this.response)["Profile"].ProfileName == ent + "_profile") {
                    sebl_addmessage("Discovery: Enterprise Profile " + ent + "_profile found");
                    sebl_discovery.status = 4;
                    sebl_setprocstep(3);
                    sebl_setprocstate(1);
                    sebl_checkentdeployed();
                }
            }
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Discovery: Enterprise Profile " + ent + "_profile not found");
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

sebl_getserverprofile = function (server) {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/profiles/servers/" + server + "_profile";

    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.response);
            if (typeof (JSON.parse(this.response)["Profile"]) !== "undefined") {
                if (JSON.parse(this.response)["Profile"].ProfileName == server + "_profile") {
                    sebl_addmessage("Discovery: Server Profile " + server + "_profile found");
                    sebl_discovery.status = 6;
                    sebl_setprocstep(5);
                    sebl_setprocstate(1);
                    sebl_checksesdeployed();
                }
            }
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Discovery: Server Profile " + server + "_profile not found");
            sebl_discovery.status = 7;
            sebl_getaiprofile(sebl_conf.fields.ai_name.value);
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}
sebl_getaiprofile = function (ai) {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/profiles/swsm/" + ai + "_profile";

    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.response);
            if (typeof (JSON.parse(this.response)["Profile"]) !== "undefined") {
                if (JSON.parse(this.response)["Profile"].ProfileName == ai + "_profile") {
                    sebl_addmessage("Discovery: AI Profile " + ai + "_profile found");
                    sebl_discovery.status = 8;
                    sebl_setprocstep(7);
                    sebl_setprocstate(1);
                    sebl_checkaideployed();
                }
            }
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Discovery: AI Profile " + ai + "_profile not found");
            sebl_getmigprofile(sebl_conf.fields.mig_name.value);
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}
sebl_getmigprofile = function (mig) {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/cloudgateway/profiles/migrations/" + mig + "_profile";

    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.response);
            if (typeof (JSON.parse(this.response)["Profile"]) !== "undefined") {
                if (JSON.parse(this.response)["Profile"].ProfileName == mig + "_profile") {
                    sebl_addmessage("Discovery: Migration Profile " + mig + "_profile found");
                    sebl_discovery.status = 10;
                    sebl_setprocstep(9);
                    sebl_setprocstate(1);
                    sebl_checkmigdeployed();
                }
            }
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Discovery: Migration Profile " + mig + "_profile not found");
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}
sebl_getmigconn = function (con) {
    var data = "";
    var xhr = new XMLHttpRequest();
    var auth = "Basic " + btoa(sebl_conf.fields.db_user.value + ":" + sebl_conf.fields.db_user_pw.value);
    var endpoint = "/siebel/v1.0/migration/connection/" + con;

    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.response);
            if (typeof (JSON.parse(this.response)["name"]) !== "undefined") {
                if (JSON.parse(this.response)["name"] == con) {
                    sebl_addmessage("Discovery: Migration Connection " + con + " found");
                    sebl_discovery.status = 12;
                    sebl_setprocstep(11);
                    sebl_setprocstate(1);
                    //sebl_checkoptimize();
                }
            }
        }
        else if (this.readyState === 4 && this.status !== 200) {
            sebl_addmessage("Discovery: Migration Connection " + con + " not found");
        }
    });

    xhr.open("GET", "https://" + sebl_conf.fields.ai_host.value + ":" + sebl_conf.fields.ai_port.value + endpoint);
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}
sebl_refresh = function () {
    //POST https://siebel20.company.com:4430/siebel/v1.0/cloudgateway/introspections
    //data = {};
}
