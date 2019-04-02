//JupyterLab, JupyterLabPlugin
import {
   JupyterLab,
  
   JupyterLabPlugin,
   ILayoutRestorer
     //JupyterFrontEnd,
   //JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import '../style/index.css';

import {
  ICommandPalette,
  InstanceTracker
} from '@jupyterlab/apputils';

import{
  JSONExt
} from '@phosphor/coreutils';

import {
  Message
} from '@phosphor/messaging';

import {
  Widget,
  
} from '@phosphor/widgets';

import {IMainMenu} from '@jupyterlab/mainmenu';

import { ISettingRegistry} from '@jupyterlab/coreutils';

const pluginId = '@jupyterlab/jupyterlab-gitpuller:extension';

namespace CommandIDs{
  export const linkName = 'jupyterlab-gitpuller:savelink';
};

//import {each} from '@phosphor/algorithm';

//import {TabBar, Widget} from '@phosphor/widgets';

import '../style/index.css';





class gitPullerWidget extends Widget {
  /**
   * Constuct Gitpuller Widget
   * 
   */

   gitpull: any;
   link: any;

   constructor(){
     super();

     // Create a single widget
   
    this.id = 'Jupyter Lab gitpuller';
    //Make and image for it 
    this.title.label = 'Gitpuller';
    this.title.closable = true;
    
    
  

    this.gitpull = document.createElement('div');
    
    
    

    this.node.appendChild(this.gitpull);

    //have it send you to a link with the form entered 
   // this.gitpull.insertAdjacentHTML('afterend', 
    //'<form >Link:<br><input id="savelink" type="text" name="link" value="some github link"><br><input onClick=saveLink() type="submit" value="Submit"><br></form>');
    this.gitpull.insertAdjacentHTML('afterend', '<input id="savelink" type="text"><br /><br />');
    (<HTMLButtonElement>this.gitpull.insertAdjacentHTML('afterend', '<button>Pull</button>'));
    this.gitpull.insertAdjacentHTML('afterend', '<br><button onClick=refresh()>Refresh with current link</button>');
   
    //gitpull.insertAdjacentHTML('afterend', '<iframe class="git" src="https://jupyterhub.github.io/nbgitpuller/link">');
     
    //this.link equals the result of this 
    

   }

   saveLink(){
    let docLink = (<HTMLInputElement>document.getElementById("savelink")).value;
    
    this.link = docLink;

    console.log(this.link);

    //do gitpuller 

  

   }

   refresh(){
     //do gitpuller
   }

   onUpdateRequest(msg: Message): void {
    fetch('https://egszlpbmle.execute-api.us-east-1.amazonaws.com/prod').then(response => {
      return response.json();
    }).then(data => {
      this.link = data.link;
      
      
    });
   } 

   

}

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer, settingRegistry: ISettingRegistry, menu: IMainMenu){
  console.log("Jupyterlab extension jupyterlab_gitpuller is activated");

  //const tabs = new TabBar<Widget>({ orientation: 'vertical' });
  let widget: gitPullerWidget;

  //app.shell.addToLeftArea(widget, {rank: 700});
   
  
  // Add an application command
  const command: string = 'Git:pull';
  app.commands.addCommand(command, {
    label: 'Pull Lab from Github',
    execute: () => {
      if(!widget){
        widget = new gitPullerWidget();
        widget.update();
      }

      if(!tracker.has(widget)){
        tracker.add(widget);
      }


      if (!widget.isAttached) {
        //button that pulls from saved thing 
        //Way to enter in a new thing 

        //Button, pull from current repo 
        //Link to Nbgitpuller form 

        // Attach the widget to the main work area if it's not there
        app.shell.addToMainArea(widget);

        

      } else {
        widget.update();
      }

      app.shell.addToLeftArea(widget, {rank: 700});

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  //const registry = app.docRegistry;
  //const when = app.restored.then(() => void 0);
  
  const onSettingsUpdated = (settings: ISettingRegistry.ISettings) => {
    const link = settings.get('link').composite as String | null;
    widget.link = link;
    //app.commands.notifyCommandChanged(CommandIDs.)
  }

  //or use literal "extension"
  Promise.all([settingRegistry.load(pluginId), app.restored])
  .then(([settings]) => {
    settings.changed.connect(onSettingsUpdated);
    onSettingsUpdated(settings);
  })
  .catch((reason: Error) => {
    console.error(reason.message);
  });
  menu.settingsMenu.addGroup([{ command: CommandIDs.linkName}], 5);
  
  app.commands.addCommand(CommandIDs.linkName, {
    label: 'Autosave Documents',
    
    execute: () => {
      const value = !widget.link;
      const key = 'link';
      return settingRegistry
        .set(pluginId, key, value)
        .catch((reason: Error) => {
          console.error(`Failed to set ${pluginId}:${key} - ${reason.message}`);
        });
    }
  });
  // Add the command to the palette.
  palette.addItem({command, category: 'GitHub'});

  let tracker = new InstanceTracker<Widget>({ namespace: 'gitpuller'});
  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'gitpuller'
  });
}



/**
 * Initialization data for the jupyterlab_gitpuller extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-gitpuller',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, ISettingRegistry, IMainMenu],
  activate: activate

};

export default extension;
