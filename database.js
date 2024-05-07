


import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://dezranljtectnaeitgql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlenJhbmxqdGVjdG5hZWl0Z3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyOTIzNDYsImV4cCI6MjAyODg2ODM0Nn0.s8_bDwnRMaYCi6PD5WvyOU8efFS2Qn3t5hK8OyYK32g';
const supabase = createClient(supabaseUrl, supabaseKey);


   // FETCH CARDS FROM SUPABASE

   export async function fetchCards() {
    let { data: cardsTwo, error } = await supabase
    .from('cardsTwo')
    .select('*');
    //   error
    if (error) {
        console.error(error);
        return false;
    }

    return cardsTwo;
};


// INSERT NEW DATA


export async function insertCard(name, place, problem, description, solution) {
    const { data, error } = await supabase
    .from('cardsTwo')
    .insert([
        { name, place, problem, description, solution },
    ])
    .select();
    // error
    if (error) {
        console.log(error.message);
        return false;
    };
    return data;
}       


export async function deleteCards(number) {
        const { error } = await supabase
        .from('cardsTwo')
        .delete()
        .eq('id', number)

    // error
    if (error) {
        console.error(error);
        return false;
    }
    
};






export async function updateCards (textDescription, id) {
const { data, error } = await supabase
  .from('cardsTwo')
  .update({ 
    description: textDescription
  })
  .eq('id', id)
  .select()
}


export async function updateCardsTwo (textSolution, id) {
    const { data, error } = await supabase
      .from('cardsTwo')
      .update({ solution: textSolution })
      .eq('id', id)
      .select()
    }


    export async function updateCardsLocal (descriptionUpdate, solutionUpdate, parentId) {
        const { data, error } = await supabase
          .from('cardsTwo')
          .update({ 
            description: descriptionUpdate,
            solution: solutionUpdate
          })
          .eq('id', parentId)
          .select()
        }