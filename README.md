<div align="center">
    <a href="https://github.com/nca-gabriel/Momo" target="_blank">
        <img src="./public/cat.svg" alt="logo" width="250" height="250" />
    </a>

  <h1>Momo</h1>
</div>

<p align="center">
  <a href="#project-description">Project Description</a> &nbsp;|&nbsp; 
  <a href="#branches">Branches</a>
  <a href="#key-components">Key Components</a> &nbsp;|&nbsp; 
  <a href="#key-features">Key Features</a> &nbsp;|&nbsp; 
  <a href="#tech-stack">Tech Stack</a> &nbsp;|&nbsp; 
    <a href="#installation">Installation</a> &nbsp;|&nbsp;
  <a href="#usage">Usage</a>

</p>

<img src="./public/page-ss.png" alt="Momo Screenshot" align="center" style="max-width:100%; height:auto;" />


## Project Description

Momo is a task management app that helps you organize tasks efficiently. It supports **tasks, notes, and todos**, and categorizes them into **daily, weekly, and upcoming views**. Users can manage subtasks, add notes, and track deadlines in a clean, responsive interface.

 


## Branches

- 🌐  **A – Frontend Only**  
  Implements the UI and task interactions using React, TypeScript, and TailwindCSS.  
  🔗 [Live Demo](https://github.com/nca-gabriel/Momo) 

- 🖥️  **B – Backend / Master**  
  Adds database persistence for tasks, notes, and todos using Prisma, MongoDB, Zod, React Hook Form, and NextAuth for authentication.  
  ⚡ Follow the [Installation](#installation) instructions to run locally.



## Key Components

- **App.tsx / Layout** – main container handling routing and page layouts.  
- **TagTodosClient** – displays tasks filtered by tag with initial data.  
- **TodoForm / NoteForm** – manage creation and editing of tasks, notes, and subtasks.  
- **Hooks** – `useTodos`, `useTags` for state management and fetching.  
- **Utils / Zod Schemas** – validation and type safety for tasks, todos, and notes.  



## Key Features

- 📅 **Task Categorization** – daily, weekly, and upcoming views for easy tracking.  
- 📝 **Notes & Todos** – add notes and subtasks under tasks.  
- 🔐 **User Authentication** – login/signup with NextAuth.  
- 📋 **Persistent Storage** – Prisma + MongoDB backend for all tasks and notes.  
- 🎨 **Responsive UI** – clean design built with TailwindCSS.  
- ⚡ **Fast & Type-Safe** – TypeScript + Zod for reliability and maintainability.  

---

## Tech Stack

**Frontend:** Next.js, React, TypeScript, TailwindCSS  
**Backend:** Prisma, MongoDB, Zod  
**Forms & Validation:** React Hook Form  
**Authentication:** NextAuth  



## Installation
```bash
git clone https://github.com/nca-gabriel/randomquotes.git
cd randomquotes
npm install
```


## Usage

Start the development server:

```bash
npm run dev
```





