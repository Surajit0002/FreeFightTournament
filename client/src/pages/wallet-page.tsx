import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import Footer from "@/components/layout/footer";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectGroup, SelectItem, 
  SelectLabel, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Transaction } from "@shared/schema";
import { 
  Wallet, ArrowUpRight, ArrowDownRight, PlusCircle, 
  MinusCircle, Clock, Check, X, Calendar, Filter, 
  LoaderCircle, CreditCard, Landmark, PiggyBank
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function WalletPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [withdrawMethod, setWithdrawMethod] = useState<string>("");
  const [accountDetails, setAccountDetails] = useState<string>("");
  
  // Fetch user's transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/user/transactions"],
  });
  
  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/transactions", {
        amount: depositAmount,
        type: "deposit",
        status: "completed", // In a real app, this would be "pending" until payment is confirmed
        reference: `Deposit via ${paymentMethod}`
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Deposit successful",
        description: `${depositAmount} coins have been added to your wallet`,
      });
      // Reset form and invalidate queries to refresh data
      setDepositAmount(0);
      setPaymentMethod("");
      queryClient.invalidateQueries({
        queryKey: ["/api/user/transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/user"],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deposit failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/transactions", {
        amount: -withdrawAmount, // Negative amount for withdrawals
        type: "withdrawal",
        status: "pending", // Withdrawals typically need approval
        reference: `Withdrawal to ${withdrawMethod}: ${accountDetails}`
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal request submitted",
        description: "Your withdrawal request is being processed",
      });
      // Reset form and invalidate queries to refresh data
      setWithdrawAmount(0);
      setWithdrawMethod("");
      setAccountDetails("");
      queryClient.invalidateQueries({
        queryKey: ["/api/user/transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/user"],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Withdrawal request failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handler for deposit form submission
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || depositAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive",
      });
      return;
    }
    
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }
    
    depositMutation.mutate();
  };
  
  // Handler for withdraw form submission
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw",
        variant: "destructive",
      });
      return;
    }
    
    if (!withdrawMethod) {
      toast({
        title: "Withdrawal method required",
        description: "Please select a withdrawal method",
        variant: "destructive",
      });
      return;
    }
    
    if (!accountDetails) {
      toast({
        title: "Account details required",
        description: "Please enter your account details",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has enough balance
    if (user && user.coins < withdrawAmount) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough coins to withdraw this amount",
        variant: "destructive",
      });
      return;
    }
    
    withdrawMutation.mutate();
  };
  
  // Set page title
  useEffect(() => {
    document.title = "Wallet | FireFight";
  }, []);
  
  // Sort transactions by date (most recent first)
  const sortedTransactions = transactions 
    ? [...transactions].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
            <Wallet className="mr-3 text-secondary h-8 w-8" />
            Wallet
          </h1>
          <p className="text-muted-foreground">
            Manage your coins, make deposits and withdrawals
          </p>
        </div>
        
        {/* Wallet Balance Card */}
        <Card className="bg-background/60 border-primary/30 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-4">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <h2 className="text-3xl md:text-4xl font-bold font-rajdhani">
                    {user ? (
                      <>{user.coins} <span className="text-lg text-muted-foreground">Coins</span></>
                    ) : (
                      <Skeleton className="h-10 w-32" />
                    )}
                  </h2>
                  {user?.cash ? (
                    <p className="text-sm text-muted-foreground">
                      ≈ {formatCurrency(user.cash)} available for withdrawal
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-accent/30 hover:border-accent/60 text-accent hover:text-accent/80"
                  onClick={() => document.getElementById('add-coins-tab')?.click()}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Add Coins
                </Button>
                <Button 
                  variant="outline" 
                  className="border-secondary/30 hover:border-secondary/60 text-secondary hover:text-secondary/80"
                  onClick={() => document.getElementById('withdraw-tab')?.click()}
                >
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Deposit/Withdraw/History Tabs */}
        <Tabs defaultValue="transactions" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="deposit" id="add-coins-tab">Add Coins</TabsTrigger>
            <TabsTrigger value="withdraw" id="withdraw-tab">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-rajdhani">Recent Transactions</CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" /> Filter
                  </Button>
                </div>
                <CardDescription>
                  View your transaction history including deposits, withdrawals, and tournament entries
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border-b border-primary/10">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-full mr-3" />
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : sortedTransactions.length > 0 ? (
                  <div className="space-y-1">
                    {sortedTransactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex justify-between items-center p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors rounded-md"
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            transaction.type === 'deposit' ? 'bg-green-500/20 text-green-500' :
                            transaction.type === 'withdrawal' ? 'bg-secondary/20 text-secondary' :
                            transaction.type === 'entry_fee' ? 'bg-primary/20 text-primary' :
                            transaction.type === 'prize' ? 'bg-accent/20 text-accent' : 'bg-muted/20'
                          }`}>
                            {transaction.type === 'deposit' && <PlusCircle className="h-5 w-5" />}
                            {transaction.type === 'withdrawal' && <MinusCircle className="h-5 w-5" />}
                            {transaction.type === 'entry_fee' && <Wallet className="h-5 w-5" />}
                            {transaction.type === 'prize' && <Trophy className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.type === 'deposit' && 'Deposit'}
                              {transaction.type === 'withdrawal' && 'Withdrawal'}
                              {transaction.type === 'entry_fee' && 'Tournament Entry'}
                              {transaction.type === 'prize' && 'Tournament Prize'}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(transaction.createdAt).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              {transaction.status === 'pending' && (
                                <span className="flex items-center text-yellow-500">
                                  <Clock className="h-3 w-3 mr-1" /> Pending
                                </span>
                              )}
                              {transaction.status === 'completed' && (
                                <span className="flex items-center text-green-500">
                                  <Check className="h-3 w-3 mr-1" /> Completed
                                </span>
                              )}
                              {transaction.status === 'failed' && (
                                <span className="flex items-center text-red-500">
                                  <X className="h-3 w-3 mr-1" /> Failed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`font-bold ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} Coins
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-bold mb-2">No transactions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your transaction history will appear here once you add coins or join tournaments.
                    </p>
                    <Button 
                      onClick={() => document.getElementById('add-coins-tab')?.click()}
                    >
                      Add Coins
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deposit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-rajdhani flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2 text-green-500" /> 
                    Add Coins
                  </CardTitle>
                  <CardDescription>
                    Purchase coins to enter tournaments and win prizes
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleDeposit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Select Amount
                        </label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <Button 
                            type="button"
                            variant="outline" 
                            className={depositAmount === 100 ? 'border-green-500 bg-green-500/10' : 'border-primary/30'}
                            onClick={() => setDepositAmount(100)}
                          >
                            100 Coins
                          </Button>
                          <Button 
                            type="button"
                            variant="outline" 
                            className={depositAmount === 500 ? 'border-green-500 bg-green-500/10' : 'border-primary/30'}
                            onClick={() => setDepositAmount(500)}
                          >
                            500 Coins
                          </Button>
                          <Button 
                            type="button"
                            variant="outline" 
                            className={depositAmount === 1000 ? 'border-green-500 bg-green-500/10' : 'border-primary/30'}
                            onClick={() => setDepositAmount(1000)}
                          >
                            1000 Coins
                          </Button>
                        </div>
                        
                        <div className="relative mt-2">
                          <Input
                            type="number"
                            placeholder="Or enter custom amount"
                            value={depositAmount || ''}
                            onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
                            className="pr-16 bg-card border-primary/30"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                            Coins
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Exchange rate: 1 Coin = ₹1
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Payment Method
                        </label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger className="bg-card border-primary/30">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Payment Options</SelectLabel>
                              <SelectItem value="upi">UPI</SelectItem>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="netbanking">Net Banking</SelectItem>
                              <SelectItem value="wallet">Paytm/PhonePe</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {paymentMethod === 'upi' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            UPI ID
                          </label>
                          <Input 
                            placeholder="username@bankname" 
                            className="bg-card border-primary/30"
                          />
                        </div>
                      )}
                      
                      {paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Card Number
                            </label>
                            <Input 
                              placeholder="1234 5678 9012 3456"
                              className="bg-card border-primary/30"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Expiry Date
                              </label>
                              <Input 
                                placeholder="MM/YY"
                                className="bg-card border-primary/30"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                CVC
                              </label>
                              <Input 
                                placeholder="123"
                                className="bg-card border-primary/30"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  
                    <Button 
                      type="submit" 
                      className="w-full mt-6"
                      disabled={depositMutation.isPending || !depositAmount || !paymentMethod}
                    >
                      {depositMutation.isPending ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> 
                          Processing...
                        </>
                      ) : (
                        <>
                          Add {depositAmount || 0} Coins
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-lg">Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 border border-primary/20 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border border-primary/20 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
                          <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-secondary">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.568 16.365L12 15.798l1.568.567-1.033-3.1 2.733-1.894-3.33-.19L12 8.234l-.938 2.947-3.33.19 2.733 1.894-1.033 3.1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">UPI</p>
                          <p className="text-xs text-muted-foreground">Google Pay, PhonePe, BHIM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border border-primary/20 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <Landmark className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Net Banking</p>
                          <p className="text-xs text-muted-foreground">All major banks supported</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-lg">Coin Packages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border border-primary/20 rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="text-xl font-bold mr-2 text-secondary">500</div>
                          <div className="text-sm">Coins</div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹450</p>
                          <p className="text-xs text-green-500">Save 10%</p>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-primary/20 rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="text-xl font-bold mr-2 text-secondary">1000</div>
                          <div className="text-sm">Coins</div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹850</p>
                          <p className="text-xs text-green-500">Save 15%</p>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-primary/20 rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="text-xl font-bold mr-2 text-secondary">2000</div>
                          <div className="text-sm">Coins</div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹1600</p>
                          <p className="text-xs text-green-500">Save 20%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="withdraw">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-rajdhani flex items-center">
                    <MinusCircle className="h-5 w-5 mr-2 text-secondary" /> 
                    Withdraw Coins
                  </CardTitle>
                  <CardDescription>
                    Convert your coins to cash and withdraw to your preferred payment method
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleWithdraw}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Withdrawal Amount
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Enter amount to withdraw"
                            value={withdrawAmount || ''}
                            onChange={(e) => setWithdrawAmount(parseInt(e.target.value) || 0)}
                            className="pr-16 bg-card border-primary/30"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                            Coins
                          </div>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm text-muted-foreground">
                            Available: {user?.coins || 0} Coins
                          </p>
                          <Button 
                            type="button" 
                            variant="link" 
                            className="h-auto p-0 text-sm"
                            onClick={() => user && setWithdrawAmount(user.coins)}
                          >
                            Max
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Withdrawal Method
                        </label>
                        <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                          <SelectTrigger className="bg-card border-primary/30">
                            <SelectValue placeholder="Select withdrawal method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Withdrawal Options</SelectLabel>
                              <SelectItem value="upi">UPI</SelectItem>
                              <SelectItem value="bank">Bank Transfer</SelectItem>
                              <SelectItem value="paytm">Paytm</SelectItem>
                              <SelectItem value="phonepe">PhonePe</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Account Details
                        </label>
                        <Input 
                          placeholder={
                            withdrawMethod === 'upi' ? 'Enter UPI ID' :
                            withdrawMethod === 'bank' ? 'Enter Account Number' :
                            withdrawMethod === 'paytm' ? 'Enter Paytm Number' :
                            withdrawMethod === 'phonepe' ? 'Enter PhonePe Number' :
                            'Enter account details'
                          }
                          value={accountDetails}
                          onChange={(e) => setAccountDetails(e.target.value)}
                          className="bg-card border-primary/30"
                        />
                      </div>
                      
                      {withdrawMethod === 'bank' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            IFSC Code
                          </label>
                          <Input 
                            placeholder="IFSC Code"
                            className="bg-card border-primary/30"
                          />
                        </div>
                      )}
                    </div>
                  
                    <Button 
                      type="submit" 
                      className="w-full mt-6"
                      disabled={
                        withdrawMutation.isPending || 
                        !withdrawAmount || 
                        !withdrawMethod || 
                        !accountDetails ||
                        (user && withdrawAmount > user.coins)
                      }
                    >
                      {withdrawMutation.isPending ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> 
                          Processing...
                        </>
                      ) : (
                        <>
                          Withdraw {withdrawAmount || 0} Coins
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
                
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm text-muted-foreground mb-2">
                    Note: Minimum withdrawal amount is 100 coins. Withdrawals are processed within 24-48 hours.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Exchange rate: 1 Coin = ₹1
                  </p>
                </CardFooter>
              </Card>
              
              <div className="space-y-6">
                <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-lg">Withdrawal Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 border border-primary/20 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <PiggyBank className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-xs text-muted-foreground">Direct to your bank account</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border border-primary/20 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
                          <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-secondary">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.568 16.365L12 15.798l1.568.567-1.033-3.1 2.733-1.894-3.33-.19L12 8.234l-.938 2.947-3.33.19 2.733 1.894-1.033 3.1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">UPI</p>
                          <p className="text-xs text-muted-foreground">Instant transfer to UPI ID</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border border-primary/20 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-accent">
                            <path d="M12 4L3 8L12 12L21 8L12 4Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M3 16L12 20L21 16" stroke="currentColor" strokeWidth="2" />
                            <path d="M3 12L12 16L21 12" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Paytm / PhonePe</p>
                          <p className="text-xs text-muted-foreground">Transfer to mobile wallets</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/60 border-primary/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-lg">FAQ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">How long do withdrawals take?</h3>
                      <p className="text-sm text-muted-foreground">
                        Withdrawals are typically processed within 24-48 hours, but may take longer during weekends or holidays.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Is there a withdrawal fee?</h3>
                      <p className="text-sm text-muted-foreground">
                        No, there are no withdrawal fees. However, your bank or payment provider may charge a small processing fee.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">What is the minimum withdrawal amount?</h3>
                      <p className="text-sm text-muted-foreground">
                        The minimum withdrawal amount is 100 coins (₹100).
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Why was my withdrawal request rejected?</h3>
                      <p className="text-sm text-muted-foreground">
                        Withdrawals may be rejected if the account details provided are incorrect or if there's a verification issue. 
                        Please contact support for assistance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
}

const Trophy = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" />
    <path d="M10 22v-8.6a3 3 0 0 0-1.73-2.7L6 9.5V4h12v5.5l-2.27 1.1A3 3 0 0 0 14 13.6V22" />
  </svg>
);
