import {FlatTreeControl} from '@angular/cdk/tree';

import { Component, OnInit } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { Menu, MenuRequest } from './interfaces/menu';
import { MenuService } from './services/menu.service';



interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface MenuNode {
  id: number;
  name: string;
  icon: string;
  url: string;
  description: string;
  menu_id: number;
  submenu?: MenuNode[];
}
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  id: number;
  name: string;
  url: string;
  icon: string;
  description: string;
  menu_id: number;
  level: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.submenu && node.submenu.length > 0,
      name: node.name,
      icon: node.icon,
      description: node.description,
      url: node.url,
      menu_id: node.menu_id,
      id: node.id,
      level: level,
    };
  };
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.submenu,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private menuService: MenuService) {}

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


  title = 'maps';
  section: 'maps' | 'lists' = 'maps';
  menu: MenuRequest= {
    name: '',
    url: '',
    description: '',
    icon: 'description',
    menu_id: 0,
  }
  menus: Menu[] = []
  showForm = false;
  descriptionMenu = ''
  allMenus: MenuRequest[] = [];
  clickMenu(menu: string) {

    console.log('menu', menu)
    this.descriptionMenu = menu;
  }
  setSection(section: 'maps' | 'lists') {
    this.section = section;
  }

  setShowForm(value: boolean){
    this.showForm = value
  }
  saveMenu(){
    if(this.menu.menu_id === 0){
      delete this.menu.menu_id
    }
    if(this.formMode === 'create'){
      this.menuService.createMenu(this.menu).subscribe((response) => {
        this.menuService.getMenus().subscribe((response) => {
          this.menus = response
          this.dataSource.data = this.menus;
          this.menu= {
            name: '',
            url: '',
            description: '',
            icon: 'description',
          }
        })
        this.menuService.getAllMenus().subscribe((response) => {
          this.allMenus = response
    
        })
      });
    }

    if(this.formMode === 'edit'){
      this.menuService.editMenu(this.menu).subscribe((response) => {
        this.menuService.getMenus().subscribe((response) => {
          this.menus = response
          this.dataSource.data = this.menus;
          this.menu= {
            name: '',
            url: '',
            description: '',
            icon: 'description',
          }
          this.formMode = 'create';
        })
        this.menuService.getAllMenus().subscribe((response) => {
          this.allMenus = response
    
        })
      });
    }
  }
  formMode: 'edit' | 'create' = 'create';

  setMenu(menu: any) {
  this.showForm = true;
  this.formMode = 'edit';
    console.log('meenueee', menu)
    this.menu = {
      description: menu.description,
      icon: menu.icon,
      menu_id: parseInt(menu.menu_id),
      name: menu.name,
      url: menu.url,
      id: menu.id,
    }
  }
  ngOnInit() {
    this.menuService.getMenus().subscribe((response) => {
      this.menus = response
      this.dataSource.data = this.menus;

    })
    this.menuService.getAllMenus().subscribe((response) => {
      this.allMenus = response

    })
    
  }

  
}
