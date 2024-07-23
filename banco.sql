create table usuario (
    id integer primary key autoincrement, 
    tipo text check( tipo in ('admin','cliente') ) not null,
    nome text not null,
    cpf text not null
);

create table telefone (
    id integer primary key autoincrement,
    numero text not null,
    id_usuario integer not null,
    eh_principal boolean not null,
    foreign key(id_usuario) references usuario (id)
);

create table email(
    email text primary key,
    id_usuario integer not null,
    eh_principal boolean not null,
    foreign key(id_usuario) references usuario (id)
);