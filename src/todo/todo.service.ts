import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';
import { StatusArgs } from './dto';

@Injectable()
export class TodoService {

    private todos: Todo[] = [
        { id: 1, description: 'Piedra del Alma', done: false },
        { id: 2, description: 'Piedra del Espacio', done: true },
        { id: 3, description: 'Piedra del Poder', done: false },
        { id: 4, description: 'Piedra del Tiempo', done: false },
    ];

    get totalTodos() {
        return this.todos.length;
    }

    get completedTodos() {
        return this.todos.filter( todo => todo.done === true ).length;
    }

    get pendingTodos() {
        return this.todos.filter( todo => todo.done === false ).length;
    }

    findAll( statusArgs: StatusArgs ): Todo[] {
        const { status } = statusArgs;
        if ( status != undefined ) return this.todos.filter( todo => todo.done = status )
        return this.todos;
    }

    findOne( id: number ) {
        const todo = this.todos.find( todo => todo.id === id );
        if ( !todo ) throw new NotFoundException( `Todo with id ${ id } not found` );
        return todo;
    }

    create( createTodoInput: CreateTodoInput ): Todo {
        const todo = new Todo();
        todo.description = createTodoInput.description;
        todo.id = Math.max( ...this.todos.map( todo => todo.id ), 0 ) + 1;
        this.todos.push( todo );
        return todo;
    }

    update( updateTodoInput: UpdateTodoInput ): Todo {
        const todoToUpdate = this.findOne( updateTodoInput.id );
        const todoToUpdated = {
            ...todoToUpdate,
            ...updateTodoInput
        }
        this.todos = this.todos.map( todo => todo.id === todoToUpdated.id ? todoToUpdated : todo );
        return todoToUpdated;
    }

    delete( id: number ): boolean {
        const todo = this.findOne( id );
        this.todos = this.todos.filter( todo => todo.id !== id );
        return true;
    }
}
