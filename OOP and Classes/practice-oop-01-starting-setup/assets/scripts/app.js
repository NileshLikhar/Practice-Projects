class DomHepler{
    static clearEventListeners(element){
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveElement(elementId, newDestinationSelector){
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
    }
}

class Component {
constructor(hostElementId, insertBefore = false){
    if(hostElementId){
        this.hostElementId = document.getElementById(hostElementId);
    }else {
        this.hostElementId = document.body;
    }
    this.insertBefore = insertBefore;
}

    detach () {
        if(this.element){
            this.element.remove();  
        }   
    }

    attach() {
        this.hostElementId.insertAdjacentElement(
            this.insertBefore ? 'afterbegin' : 'beforeend',
            this.element
        );
    }
}

class Tooltip extends Component {
    constructor(closeNotifireFunction) {
        super();
        this.closeNotifire = closeNotifireFunction;
        this.create();
    }

    closeTooltip = () => {
        this.detach();
        this.closeNotifire();
    };

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        tooltipElement.textContent = 'Dummy';
        tooltipElement.addEventListener('click', this.closeTooltip);
        this.element = tooltipElement;
    }
}

class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction, type){
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
    }

    showMoreInfoHandler() {
        if(this.hasActiveTooltip){
            return;
        }
        const tooltip = new Tooltip(() => {
            this.hasActiveTooltip = false;
        });
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click',this.showMoreInfoHandler);
    }

    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id);
        let switchButton = projectItemElement.querySelector('button:last-of-type');
        switchButton =  DomHepler.clearEventListeners(switchButton);
        switchButton.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchButton.addEventListener(
        'click',
        this.updateProjectListsHandler.bind(null, this.id)
        );
    }
    update(updateProjectListsFn,type) {
        this.updateProjectListsHandler = updateProjectListsFn;
        this.connectSwitchButton(type);
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
       
        const projectItems = document.querySelectorAll(`#${type}-projects li`);
        for (const projectItem of projectItems ){
            this.projects.push(
                new ProjectItem(projectItem.id, this.switchProject.bind(this), this.type)
            );
        }
        console.log(this.projects);
    }

    setSwiitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DomHepler.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
        
    }

    switchProject(projectID) {
        // const projectIndex = this.projects.findIndex(p =>p.id === projectID);
        // this.projects.splice(projectIndex,1);
        this.switchHandler(this.projects.find(p => p.id === projectID));
        this.projects = this.projects.filter(p => p.id !==projectID);
    }
}

class App {
    static inti() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwiitchHandlerFunction(
            finishedProjectList.addProject.bind(finishedProjectList)
        );

        finishedProjectList.setSwiitchHandlerFunction(
            activeProjectList.addProject.bind(activeProjectList)
        );
    }
}

App.inti();