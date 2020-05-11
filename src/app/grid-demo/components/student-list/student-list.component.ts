import { Component, OnInit, forwardRef } from '@angular/core';
import { DStore, IQueryResult, ITableColumn, LocalViewDStore, ColumnTypeEnum, ITableButton } from 'xcloud-grid';
import * as faker from 'faker';

interface IStudent {
    id?: number;
    name: string;
    age: number;
    gender: string;
    country: string;
    remark?: string;
}

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    providers: [
        {
            provide: DStore,
            useExisting: forwardRef(() => StudentListComponent)
        }
    ]
})
export class StudentListComponent extends LocalViewDStore implements OnInit {

    public tableButtons: Array<ITableButton> = [
        // {
        //     key: 'edit',
        //     name: '编辑'
        // }
    ];

    public constructor() {
        super();
    }

    public async ngOnInit(): Promise<void> {
        this.gridStartup({
            // selectMode: "multiple",
            // selectMode: "single",
        });
    }

    public async getColumns(): Promise<Array<ITableColumn>> {
        let arr: Array<ITableColumn> = [
            {
                name: '名称',
                field: 'name',
                sort: true
            },
            {
                name: '年纪',
                field: 'age',
                sort: true,
                fieldType: ColumnTypeEnum.Number
            },
            {
                name: '性别',
                field: 'gender',
                sort: true,
                fieldType: ColumnTypeEnum.Number
            },
            {
                name: '国籍',
                field: 'country',
                sort: true,
                fieldType: ColumnTypeEnum.Number
            },
            {
                name: '备注',
                field: 'remark'
            }
        ];
        return arr;
        return new Promise(res => {
            setTimeout(() => {
                res(arr);
            }, 2000);
        });
    }

    public async onQuery(queryParam?: { [key: string]: any }): Promise<IQueryResult<any>> {
        console.log('query work!');
        let students: Array<IStudent> = [];

        for (let i: number = 0; i < 50; i++) {
            let s: IStudent = {
                id: i,
                name: faker.name.findName(),
                gender: i % 2 == 0 ? '女' : '男',
                age: faker.random.number({ min: 8, max: 50 }),
                country: faker.address.country(),
                remark: faker.lorem.paragraph()
            };
            students.push(s);
        }

        return {
            items: students,
            count: 500
        };
    }

    public async onDataSelected(datas: Array<any>): Promise<void> {
        console.log('data selected', datas);
    }
}
