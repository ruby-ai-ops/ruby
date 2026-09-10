import SparkleTokens
import SwiftUI

@main
struct RubyMobileApp: App {
    @StateObject private var authViewModel = AuthViewModel()

    init() {
        SparkleFonts.registerFonts()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .background(Color.rubyBackground.ignoresSafeArea())
                .environmentObject(authViewModel)
                .onOpenURL { url in
                    authViewModel.handleCallbackURL(url)
                }
        }
    }
}
