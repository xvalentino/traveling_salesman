class Chromosome

  attr_accessor :data
  attr_accessor :normalized_fitness

  def initialize(data)
    @data = data
  end

  # The fitness method quantifies the optimality of a solution 
  # (that is, a chromosome) in a genetic algorithm so that that particular 
  # chromosome may be ranked against all the other chromosomes. 
  # 
  # Optimal chromosomes, or at least chromosomes which are more optimal, 
  # are allowed to breed and mix their datasets by any of several techniques, 
  # producing a new generation that will (hopefully) be even better.
  def fitness
    return @fitness if @fitness
    last_token = @data[0]
    cost = 0
    @data[1..-1].each do |token|
      cost += @@costs[last_token][token]
      last_token = token
    end
    @fitness = -1 * cost
    return @fitness
  end

  # mutation method is used to maintain genetic diversity from one 
  # generation of a population of chromosomes to the next. It is analogous 
  # to biological mutation. 
  # 
  # The purpose of mutation in GAs is to allow the 
  # algorithm to avoid local minima by preventing the population of 
  # chromosomes from becoming too similar to each other, thus slowing or even 
  # stopping evolution.
  # 
  # Calling the mutate function will "probably" slightly change a chromosome
  # randomly. 
  #
  # This implementation of "mutation" will (probably) reverse the 
  # order of 2 consecutive randome nodes 
  # (e.g. from [ 0, 1, 2, 4] to [0, 2, 1, 4]) if:
  #     ((1 - chromosome.normalized_fitness) * 0.4)
  def self.mutate(chromosome)
    if chromosome.normalized_fitness && rand < ((1 - chromosome.normalized_fitness) * 0.6)
      data = chromosome.data
      index = rand(data.length-1)
      data[index], data[index+1] = data[index+1], data[index]
      chromosome.data = data
      @fitness = nil
    end
  end

  # Reproduction method is used to combine two chromosomes (solutions) into 
  # a single new chromosome. There are several ways to
  # combine two chromosomes: One-point crossover, Two-point crossover,
  # "Cut and splice", edge recombination, and more. 
  # 
  # The method is usually dependant of the problem domain.
  # In this case, we have implemented edge recombination, wich is the 
  # most used reproduction algorithm for the Travelling salesman problem.
  def self.reproduce(a, b)
    data_size = @@costs[0].length
    available = []
    0.upto(data_size-1) { |n| available << n }
    token = a.data[0]
    spawn = [token]
    available.delete(token)
    while available.length > 0 do 
      #Select next
      if token != b.data.last && available.include?(b.data[b.data.index(token)+1])
        next_token = b.data[b.data.index(token)+1]
      elsif token != a.data.last && available.include?(a.data[a.data.index(token)+1])
        next_token = a.data[a.data.index(token)+1] 
      else
        next_token = available[rand(available.length)]
      end
      #Add to spawn
      token = next_token
      available.delete(token)
      spawn << next_token
      a, b = b, a if rand < 0.4
    end
    return Chromosome.new(spawn)
  end

  # Initializes an individual solution (chromosome) for the initial 
  # population. Usually the chromosome is generated randomly, but you can 
  # use some problem domain knowledge, to generate a 
  # (probably) better initial solution.
  def self.seed
    data_size = @@costs[0].length
    available = []
    0.upto(data_size-1) { |n| available << n }
    seed = []
    while available.length > 0 do 
      index = rand(available.length)
      seed << available.delete_at(index)
    end
    return Chromosome.new(seed)
  end

  def self.set_cost_matrix(costs)
    @@costs = costs
  end
end
